(defproject spock "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.1"]
                 [it.unibo.tuprolog/solve-jvm "0.17.4-dev09+485a46b2"]
                 [it.unibo.tuprolog/solve-classic-jvm "0.17.4-dev09+485a46b2"]]
  :repl-options {:init-ns user}
  :profiles {:dev {:dependencies [[check "0.2.0-SNAPSHOT"]]}})
