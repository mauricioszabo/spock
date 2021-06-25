(ns spock.commons
  (:require [clojure.walk :as walk]))

(defn- compose-with [tail between wrap]
  (let [tail (if wrap
               (->> tail
                    (partition 2 1)
                    (map (partial apply list wrap)))
               tail)]
    ((fn rec [[f & rs]]
       (if (seq rs)
         (list between f (rec rs))
         f))
     tail)))

(defn- inner-normalize-struct [struct-list]
  (let [[tag & body] struct-list]
    (case tag
      not= (compose-with body "," "=\\=")
      = (compose-with body "," "=")
      or (compose-with body ";" nil)
      and (compose-with body "," nil)
      :- (list ":-"
               (first body)
               (compose-with (rest body) "," nil))
      (apply list (name tag) body))))

(defn normalize-struct [struct-list]
  (walk/postwalk #(cond-> % (seq? %) inner-normalize-struct)
                struct-list))

(defn normalize-arg [nameable]
   (case nameable
     not= "=\\="
     or ";"
     and ","
     :- ":-"
     (name nameable)))

(def compound-types
  #{"=\\="
    "="
    "-"
    "+"
    "*"
    "/"
    ","
    ";"
    ":-"})
