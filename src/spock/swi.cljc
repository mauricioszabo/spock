(ns spock.swi
  (:require [spock.commons :as commons]
            [clojure.walk :as walk]
            [clojure.set :as set])
  (:import [org.jpl7 Atom Variable Compound Term Query]))

(defn- as-atom [keyword]
  (Atom. (commons/normalize-arg keyword)))

(defn- as-var [symbol]
  (-> symbol name Variable.))

(defprotocol AsProlog
  (to-prolog [this]))

(defn- as-list [this]
  (let [size (count this)]
    (cond
      (and (= 2 size) (-> this first (= '&)))
      (-> this last to-prolog)

      (zero? size)
      (Term/textToTerm "[]")

      :else
      (Compound. "[|]" (into-array Term [(-> this first to-prolog)
                                         (-> this rest as-list)])))))

(defn- as-struct [unparsed]
  (let [[head & tail] (commons/normalize-struct unparsed)]
    (Compound. head (into-array Term (map to-prolog tail)))))

(extend-protocol AsProlog
  clojure.lang.Keyword
  (to-prolog [this] (as-var this))

  clojure.lang.Symbol
  (to-prolog [this] (as-atom this))

  clojure.lang.LazySeq
  (to-prolog [this] (as-struct this))
  clojure.lang.Cons
  (to-prolog [this] (as-struct this))
  clojure.lang.PersistentList
  (to-prolog [this] (as-struct this))

  clojure.lang.PersistentVector
  (to-prolog [this] (as-list this))

  Object
  (to-prolog [this]
    (Term/textToTerm (pr-str this))))

(defprotocol ITemporaryFacts
  (rename-query [_ q])
  (rename-result [_ res]))

(defrecord TemporaryFacts [rules renames]
  ITemporaryFacts
  (rename-query [_ q]
    (walk/postwalk-replace renames q))

  (rename-result [_ res]
    (walk/postwalk-replace (set/map-invert renames) res))

  java.io.Closeable
  (close [_]
    (doseq [rule rules
            :let [retraction (->> rule rest (cons 'retract))]]
      (-> retraction as-struct Query. .oneSolution))))

(defn- as-fact [fact-name params]
  (->> params
       (cons fact-name)
       (list 'assert)))

(defn- as-rule [fact-name params rules]
  (let [body (cons 'and rules)
        fact (->> params
                  (cons fact-name))]
    (->> body
         (list :- fact)
         (list 'assert))))

(defn with-rules [rules]
  (let [trs (->> rules
                 (map first)
                 (map (juxt identity #(gensym (str % "-"))))
                 (into {}))
        randomize (memoize #(cond-> % (symbol? %) (trs %)))
        new-rules (walk/postwalk randomize rules)
        rules (for [row new-rules
                    :let [parsed (case (count row)
                                   1 (list 'assert row)
                                   2 (as-fact (nth row 0) (nth row 1))
                                   3 (as-rule (nth row 0) (nth row 1) (nth row 2)))]]
                parsed)]
    (doseq [rule rules]
      (-> rule as-struct Query. .oneSolution))
    (->TemporaryFacts rules trs)))

(defprotocol FromProlog
  (from-prolog [this]))

(defn- from-compound [^Term term]
  (if (.isList term)
    (->> term .listToTermArray (mapv from-prolog))
    (let [name (.name term)
          fields (->> term .args (map from-prolog))]
      (doall (cons (symbol name) fields)))))

(extend-protocol FromProlog
  Atom
  (from-prolog [this]
    (if (.isList this)
      (from-compound this)
      (-> this .name symbol)))

  Variable
  (from-prolog [this] (-> this .name keyword))

  org.jpl7.Integer
  (from-prolog [this]
    (if (.isBigInteger this)
      (-> this str bigint)
      (.longValue this)))

  org.jpl7.Float
  (from-prolog [this] (.doubleValue this))

  Compound
  (from-prolog [this] (from-compound this)))

(defn- bind-vals [bind query]
  (->> bind
       (map (fn [[k v]] (list '= k v)))
       (cons query)
       (cons 'and)))

(defn solve
  ([query] (solve {} query))
  ([{:keys [rules bind]} query]
   (let [query (cond->> query
                        bind (bind-vals bind)
                        rules (rename-query rules))
         from-prolog (if rules
                       (comp #(rename-result rules %) from-prolog)
                       from-prolog)]
     (->> query
          to-prolog
          Query.
          iterator-seq
          (mapv (fn [match]
                  (->> (.entrySet match)
                       (map (fn [e] [(-> e .getKey keyword)
                                     (-> e .getValue from-prolog)]))
                       (into {}))))))))
