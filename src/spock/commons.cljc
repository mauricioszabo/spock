(ns spock.commons)

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

(defn normalize-struct [tag body]
  (case tag
    not= (compose-with body "," "=\\=")
    = (compose-with body "," "=")
    or (compose-with body ";" nil)
    and (compose-with body "," nil)
    :- (list ":-"
             (first body)
             (compose-with body "," nil))
    (apply list (name tag) body)))

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
