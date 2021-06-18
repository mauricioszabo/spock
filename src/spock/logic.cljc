(ns spock.logic
  (:import [it.unibo.tuprolog.solve Solver SolverFactory Solution]
           [it.unibo.tuprolog.solve.classic ClassicSolver]
           [it.unibo.tuprolog.theory Theory]
           [it.unibo.tuprolog.core Struct Rule Fact Var Term Conversions Substitution
            Cons]))

(defn- normalize-arg [nameable]
  (let [n (name nameable)]
    (case n
      "not=" "=\\="
      n)))

(defn- as-atom [keyword]
  (Struct/of (normalize-arg keyword) []))

(defn- as-var [symbol]
  (-> symbol name Var/of))

(defprotocol AsProlog
  (-to-prolog [this -to-prolog]))

(defn- memoize'
  "Almost the same as memoize, but ignores _ symbol"
  [f]
  (let [mem (atom {})]
    (fn [& args]
      (if (-> args first (= '_))
        (apply f args)
        (if-let [e (find @mem args)]
          (val e)
          (let [ret (apply f args)]
            (swap! mem assoc args ret)
            ret))))))

(defn- as-fact
  ([fact-name args]
   (as-fact fact-name args (memoize' -to-prolog)))

  ([fact-name args -to-prolog]
   (.setHeadArgs (Fact/of (as-atom fact-name))
                 (map #(-to-prolog % -to-prolog) args))))

(defn as-struct
  ([struct-name args]
   (as-struct struct-name args))

  ([struct-name args -to-prolog]
   (Struct/of (normalize-arg struct-name)
              (map #(-to-prolog % -to-prolog) args))))

(defn- as-rule [rule-name args body]
  (let [-to-prolog (memoize' -to-prolog)]
    (Rule/of (as-struct rule-name args -to-prolog)
             (->> body
                  (map #(-to-prolog % -to-prolog))
                  (into-array Term)))))

(defn- as-list [this -to-prolog]
  (let [[bef after] (split-with #(not= % '&) this)]
    (if (and (seq bef) (-> after count (= 2)))
      (let [[fst & rst] bef]
        (reduce (fn [tail next]
                  (Cons/of (-to-prolog next -to-prolog) tail))
                (-> after last (-to-prolog -to-prolog))
                (reverse bef)))
      (->> this (map #(-to-prolog % -to-prolog)) Conversions/toTerm))))

(extend-protocol AsProlog
  clojure.lang.Keyword
  (-to-prolog [this _] (as-atom this))

  clojure.lang.Symbol
  (-to-prolog [this _] (as-var this))

  clojure.lang.PersistentList
  (-to-prolog [this -to-prolog] (as-struct (first this) (rest this) -to-prolog))

  clojure.lang.PersistentVector
  (-to-prolog [this -to-prolog] (as-list this -to-prolog))

  Object
  (-to-prolog [this -to-prolog] (Conversions/toTerm this)))

(defn as-prolog [params]
  (if (-> params count (= 2))
    (as-fact (nth params 0) (nth params 1))
    (as-rule (nth params 0) (nth params 1) (nth params 2))))

(defn solver [rules]
  (->> rules
       (map as-prolog)
       Theory/of
       (.solverWithDefaultBuiltins (Solver/getClassic))))

(defprotocol FromProlog
  (from-prolog [this]))

(extend-protocol FromProlog
  it.unibo.tuprolog.core.Atom
  (from-prolog [this] (-> this .getFunctor keyword))

  it.unibo.tuprolog.core.Var
  (from-prolog [this] (-> this .getName symbol))

  it.unibo.tuprolog.core.Integer
  (from-prolog [this] (-> this str bigint))

  it.unibo.tuprolog.core.Integer
  (from-prolog [this] (-> this str bigint))

  it.unibo.tuprolog.core.Real
  (from-prolog [this] (-> this str bigdec))

  it.unibo.tuprolog.core.List
  (from-prolog [this]
    (if (.isEmptyList this)
      []
      (->> this
           .getUnfoldedList
           butlast
           (mapv from-prolog))))

  Object
  (from-prolog [this] (.getValue this)))

(defn- sub->clj [^Substitution s]
  [(-> s .getKey .getName keyword)
   (-> s .getValue from-prolog)])

(defn- sol->clj [^Solution sol]
  (->> sol
       .getSubstitution
       (map sub->clj)
       (into {})))

(defn to-prolog [elem] (-to-prolog elem (memoize' -to-prolog)))

(defn solve [p-solver query vars]
  (let [p-solver (or p-solver (solver []))
        prolog-q (to-prolog query)
        i (.. p-solver
              (solve prolog-q)
              iterator)]
    (->> i
         iterator-seq
         (filter #(.isYes %))
         (map sol->clj))))
