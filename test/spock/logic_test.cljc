(ns spock.logic-test
  (:require [clojure.test :refer [deftest testing]]
            [check.core :refer [check]]
            [spock.logic :as spock]
            [matcher-combinators.matchers :as m]))

(def family-rules
  '[[:parent [:father :son]]
    [:parent [:son :grandson]]

    [:ancestor [x y] [[:parent x y]]]
    [:ancestor [x y] [[:parent x z]
                      [:ancestor z y]]]])

(deftest simple-solver
  (let [prolog (spock/solver family-rules)]
    (testing "will make queries and bound unbound variables"
      (check (spock/solve prolog '[:ancestor :father child] {})
             => (m/in-any-order [{:child :son}
                                 {:child :grandson}])))

    #_
    (testing "will make queries and allow to seed unbound vars"
      (check (spock/solve prolog '[:ancestor [father child]] {:father :father})
             => (m/in-any-order [{:child :son}
                                 {:child :grandson}])))))
