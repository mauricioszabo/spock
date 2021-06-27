(defproject link.szabo.mauricio/spock "0.1.0"
  :description "Wrapper for TuProlog and SWI-Prolog in Clojure"
  :url "http://example.com/FIXME"
  :license {:name "2-Clause BSD"
            :url "https://opensource.org/licenses/BSD-2-Clause"}
  :dependencies [[org.clojure/clojure "1.10.1"]]

  :repl-options {:init-ns user}
  :profiles {:dev {:dependencies [[check "0.2.0-SNAPSHOT"]
                                  [it.unibo.tuprolog/solve-jvm "0.17.4-dev09+485a46b2"]
                                  [it.unibo.tuprolog/solve-classic-jvm "0.17.4-dev09+485a46b2"]]
                   :resource-paths ["resources/jpl.jar"]
                   :jvm-opts [~(str "-Djava.library.path=resources/:" (System/getProperty "java.library.path"))]}})
