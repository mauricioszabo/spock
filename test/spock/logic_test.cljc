(ns spock.logic-test
  (:require [clojure.test :refer [deftest testing]]
            [check.core :refer [check]]
            [spock.logic :as spock]
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
      (check (spock/solve prolog '(ancestor father :child) {})
             => (m/in-any-order '[{:child son}
                                  {:child grandson}])))

    (testing "will make queries and allow to seed unbound vars"
      (check (spock/solve prolog '(ancestor :x :child) {:bind {:x 'father}})
             => (m/in-any-order '[{:child son}
                                  {:child grandson}])))))

(deftest conversions
  (testing "will convert arrays/numbers"
    (check (spock/solve nil '(append :x :y [1 2 3]) {})
          => (m/in-any-order [{:x [] :y [1 2 3]}
                              {:x [1] :y [2 3]}
                              {:x [1 2] :y [3]}
                              {:x [1 2 3] :y []}])))

  (testing "converting some placeholders"
    (check (spock/solve nil '(= [:_ & :n] [1 2 3 4]) {})
           => [{:n [2 3 4]}])

    (check (spock/solve nil '(= [:_ :_ :n] [1 2 3]) {})
           => [{:n 3}])

    (check (spock/solve nil '(= 1 1) {})
           => [{}])

    (check (spock/solve nil '(not= 1 2) {})
           => [{}])))

(def n-queens
  '[(:n_queen [solution]
              [(= solution [_ _ _ _])
               (:queen solution 4)])
    (:up2n [n n [n]] [:!])
    (:up2n (k,n,[k & tail]) [(< k n)
                             (:is k1 (+ k 1))
                             (:up2n k1 n tail)])
    (:queen ([] _))
    (:queen ([q & qlist],n) [(:queen qlist, n)
                             (:up2n 1 n candidate_positions_for_queenq)
                             (:member q, candidate_positions_for_queenq)
                             (:check_solution q,qlist, 1)])

    (:check_solution (_ [] _))
    (:check_solution (q [q1 & qlist] xdist)
                     [(:not= q q1)
                      (:is test (:abs (- q1 q)))
                      (:not= test xdist)
                      (:is xdist1 (+ xdist 1))
                      (:check_solution q qlist xdist1)])])

(spock/solve (spock/solver n-queens)
             '(:n_queen solution)
             {})
