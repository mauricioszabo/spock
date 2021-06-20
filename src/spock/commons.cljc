(ns spock.commons)

(defn normalize-arg [nameable]
  (let [n (name nameable)]
    (case n
      "not=" "=\\="
      "or" ";"
      "and" ","
      n)))
