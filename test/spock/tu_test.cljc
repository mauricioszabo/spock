(ns spock.tu-test
  (:require [clojure.test :refer [deftest testing]]
            [check.core :refer [check]]
            [spock.tu :as spock]
            [matcher-combinators.matchers :as m]))

(def family-rules
  '[(parent [father son])
    (parent [son grandson])

    (ancestor [:x :y] [(parent :x :y)])
    (ancestor [:x :y] [(parent :x :z)
                       (ancestor :z :y)])])

(deftest simple-solver
  (let [prolog (spock/solver family-rules)]
    (testing "will make queries and bound unbound variables"
      (check (spock/solve {:rules prolog} '(ancestor father :child))
             => (m/in-any-order '[{:child son}
                                  {:child grandson}])))

    #_
    (testing "will make queries and allow to seed unbound vars"
      (check (spock/solve {:rules prolog} '(ancestor :x :child) {:bind {:x 'father}})
             => (m/in-any-order '[{:child son}
                                  {:child grandson}])))))

(deftest conversions
  (testing "will convert arrays/numbers"
    (check (spock/solve '(append :x :y [1 2 3]))
          => (m/in-any-order [{:x [] :y [1 2 3]}
                              {:x [1] :y [2 3]}
                              {:x [1 2] :y [3]}
                              {:x [1 2 3] :y []}])))

  (testing "converting some placeholders"
    (check (spock/solve '(= [:_ & :n] [1 2 3 4])) => [{:n [2 3 4]}])
    (check (spock/solve '(= [:_ :_ :n] [1 2 3])) => [{:n 3}]))

  (testing "converting equality"
    (check (spock/solve '(= 1 1)) => [{}])
    (check (spock/solve '(not= 1 2)) => [{}]))

  (testing "converting or/and"
    (check (spock/solve '(or (= :a 1) (= :a 2)))
           => (m/in-any-order [{:a 1} {:a 2}]))

    (check (spock/solve '(and (member :a [1 2 3]) (= :a 2)))
           => [{:a 2}])))
  ;
  ; (testing "converting :-"
  ;   (check (spock/solve nil '(and (:- (ex :a) (= :a 10))
  ;                                 (ex :b)) {})
  ;          => [{:b 10}])))
