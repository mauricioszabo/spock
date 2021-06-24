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
;
; (def n-queens
;   '[(:n_queen [solution]
;               [(= solution [_ _ _ _])
;                (:queen solution 4)])
;     (:up2n [n n [n]] [:!])
;     (:up2n (k,n,[k & tail]) [(< k n)
;                              (:is k1 (+ k 1))
;                              (:up2n k1 n tail)])
;     (:queen ([] _))
;     (:queen ([q & qlist],n) [(:queen qlist, n)
;                              (:up2n 1 n candidate_positions_for_queenq)
;                              (:member q, candidate_positions_for_queenq)
;                              (:check_solution q,qlist, 1)])
;
;     (:check_solution (_ [] _))
;     (:check_solution (q [q1 & qlist] xdist)
;                      [(:not= q q1)
;                       (:is test (:abs (- q1 q)))
;                       (:not= test xdist)
;                       (:is xdist1 (+ xdist 1))
;                       (:check_solution q qlist xdist1)])])

; (spock/solve (spock/solver n-queens)
;              '(:n_queen solution)
;              {})

; (def n-queens
;   '[(n_queen [:solution]
;              [(= :solution [:_ :_ :_ :_])
;               (queen :solution 4)])
;
;     (up2n [:n :n [:n]] [!])
;     (up2n (:k :n [:k & :tail]) [(< :k :n)
;                                 (is :k1 (+ :k 1))
;                                 (up2n :k1 :n :tail)])
;     (queen ([] :_))
;     (queen ([:q & :qlist] :n) [(queen :qlist :n)
;                                (up2n 1 :n :candidate_positions_for_queenq)
;                                (member :q, :candidate_positions_for_queenq)
;                                (check_solution :q :qlist 1)])
;
;     (check_solution (:_ [] :_))
;     (check_solution (:q [:q1 & :qlist] :xdist)
;                     [(not= :q :q1)
;                      (is :test (:abs (- :q1 :q)))
;                      (not= :test :xdist)
;                      (is :xdist1 (+ :xdist 1))
;                      (check_solution :q :qlist :xdist1)])])

; (require 'criterium.core)
; (criterium.core/quick-bench
;  (spock/solve (spock/solver n-queens)
;               '(n_queen :s)
;               {}))
;
; (def e (org.jpl7.fli.Prolog/create_engine))
; (-> (org.jpl7.Query. (org.jpl7.Term/textToTerm "assert(parent(father, son))"))
;     iterator-seq
;     doall)
;
; (-> (org.jpl7.Query. (org.jpl7.Term/textToTerm "assert(ancestor(X, Y) :- parent(X, Y))"))
;     iterator-seq
;     doall)
;
; (org.jpl7.Term/textToTerm "B=father, ancestor(B, A)")
; (-> (org.jpl7.Query. (org.jpl7.Term/textToTerm "ancestor(father, A)"))
;     iterator-seq
;     doall)
;
; (def q (org.jpl7.Query. (org.jpl7.Term/textToTerm "A = 10")))
; (doall (iterator-seq q))
;
; (org.jpl7.Term/textToTerm "A = 10")
; (org.jpl7.Term/textToTerm "knows(X, Y) :- parent(X, Y)")
; (org.jpl7.Compound. "teacher"
;                     (into-array [(org.jpl7.Atom. "foo")
;                                  (org.jpl7.Atom. "bar")]))
; Compound t1 = new Compound(
;                            "teacher_of",
;                            new Term[] {
;                                        new Atom("aristotle"),
;                                        new Atom("alexander")})
;
; ;
;
; (org.jpl7.Atom)
; (println
;  (System/getProperty "java.library.path"))
