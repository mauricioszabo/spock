(ns spock.commons-test
  (:require [spock.commons :as commons]
            [clojure.test :refer [deftest testing]]
            [check.core :refer [check]]))

(deftest normalization
  (testing "normalize and"
    (check (commons/normalize-struct '(and 10)) => '10)
    (check (commons/normalize-struct '(and 10 20))
           => '("," 10 20))
    (check (commons/normalize-struct '(and 10 20 30))
           => '("," 10 ("," 20 30))))

  (testing "normalize or"
    (check (commons/normalize-struct '(or 10)) => '10)
    (check (commons/normalize-struct '(or 10 20))
           => '(";" 10 20))
    (check (commons/normalize-struct '(or 10 20 30))
           => '(";" 10 (";" 20 30))))

  (testing "normalize deeps ANDs and ORs"
    (check (commons/normalize-struct '(or 10
                                          (and 20 30)
                                          (or 40)
                                          (or (and 50 60))))
           => '(";" 10
                    (";" ("," 20 30)
                         (";" 40
                              ("," 50 60))))))

  (testing ""))
