(ns spock.swi-test
  (:require [clojure.test :refer [deftest testing]]
            [check.core :refer [check]]
            [spock.swi :as spock]
            [matcher-combinators.matchers :as m]))

(def family-rules
  '[(parent [father son])
    (parent [son grandson])

    (ancestor [:x :y] [(parent :x :y)])
    (ancestor [:x :y] [(parent :x :z)
                       (ancestor :z :y)])])

(deftest simple-solver
  (with-open [prolog (spock/with-rules family-rules)]
    (testing "will make queries and bound unbound variables"
      (check (spock/solve {:rules prolog} '(ancestor father :child))
             => (m/in-any-order '[{:child son}
                                  {:child grandson}])))

    (testing "will make queries and allow to seed unbound vars"
      (check (spock/solve {:rules prolog, :bind {:x 'father}} '(ancestor :x :child))
             => (m/in-any-order '[{:child son}
                                  {:child grandson}])))))

(deftest conversions
  (testing "will rename only rules' symbols"
    (with-open [prolog (spock/with-rules '[(get-odd [:a] [(member :a [1 3 5])])])]
      (check (spock/solve {:rules prolog} '(get-odd :odd))
             => (m/in-any-order [{:odd 1}
                                 {:odd 3}
                                 {:odd 5}]))))

  (testing "will convert arrays/numbers"
    (check (spock/solve '(append :x :y [1 2 3]))
          => (m/in-any-order [{:x [] :y [1 2 3]}
                              {:x [1] :y [2 3]}
                              {:x [1 2] :y [3]}
                              {:x [1 2 3] :y []}])))

  (testing "converting some placeholders"
    (check (spock/solve '(= [:_ & :n] [1 2 3 4]))
           => [{:n [2 3 4]}])

    (check (spock/solve '(= [:_ :_ :n] [1 2 3]))
           => [{:n 3}])

    (check (spock/solve '(= 1 1))
           => [{}])

    (check (spock/solve '(not= 1 2))
           => [{}])))

(deftest clojure-objects
  (testing "binds CLJ objects to Prolog"
    (check (spock/solve {:bind {:map {"a-key" 10}}}
                        '(jpl_call :map get ["a-key"] :result))
           => [{:result 10}])))

(deftest ^{:doc "All facts in SWI-Prolog JPL bridge are global. What
with-facts do is rename most of these facts to be local. In this case,
the facts will remain global indeed, and `.close` will retract them."}
  global-asserts

  (with-open [_ (spock/assert-rules family-rules)]
    (check (spock/solve '(ancestor father :child))
           => (m/in-any-order '[{:child son}
                                {:child grandson}]))))
