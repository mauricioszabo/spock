(ns spock.swi
  (:require [instaparse.core :as insta]
            [clojure.string :as str]))

(def swi (js/require "./swipl-web"))
;
(def parse-prolog
  (insta/parser
    "
<terms> = term (<', '> term)*
<term> = equality | atom | var | number | boolean | structure | list | string
equality = var <' = '>  term
list = <'[]'> | <'['> term (<', '> term)*  <']'>
structure = atom <'('> terms <')'>
string = <'\"'> (#\"[^\\\"]+\" | '\\\"')* <'\"'>
atom = atom-prefix letter* | \"'\" atom-sequence* \"'\"
<atom-sequence> = #\"(\\\\'|[^'])\"
var = var-prefix letter*
<atom-prefix> = #\"[a-z]\"
<letter> = #\"[\\d\\w_]\"
<var-prefix> = #\"[A-Z_]\"
number = #\"\\d+(\\.\\d+)?\"
boolean = 'true' | 'false'
"))

(defmulti parse-out first)
(defmethod parse-out :equality [[_ var thing]] {(parse-out var) (parse-out thing)})
(defmethod parse-out :list [[_ & params]] (mapv parse-out params))
(defmethod parse-out :structure [[_ & structs]] (map parse-out structs))
(defmethod parse-out :string [[_ & str]] (str/join "" str))
(defmethod parse-out :atom [[_ & var]]
  (let [var-name (str/join "" var)]
    (-> var-name
        str/lower-case
        (str/replace-first #"^'" "")
        (str/replace-first #"'$" "")
        (str/replace #"_" "-")
        symbol)))

(defmethod parse-out :var [[_ & var]]
  (let [var-name (str/join "" var)]
    (-> var-name
        str/lower-case
        (str/replace-first #"^_" "")
        (str/replace #"_" "-")
        keyword)))

(defmethod parse-out :number [[_ num]] (js/parseInt num))
(defmethod parse-out :boolean [[_ b]] (= b "true"))

(defonce streams (atom {:pos 0
                        :code "A = 10."
                        :out ""
                        :parsed []}))

(defn- parse-stdout-into-map [out]
  (let [prolog-res (try (-> out
                            (str/replace #"(\n|\s)+" " ")
                            str/trim
                            (str/replace #"\.$" "")
                            parse-prolog
                            (->> (map parse-out)))
                     (catch :default e
                       (prn :INVALID-QUERY e)
                       ::invalid))]
    (cond
      (keyword? prolog-res) prolog-res
      (-> prolog-res first map?) (reduce merge {} prolog-res)
      (-> prolog-res first true?) {})))

(defn stdin-code []
  (let [{:keys [pos code out next?]} @streams]
    (if (< pos (count code))
      (let [code (.charCodeAt code pos)]
        (swap! streams update :pos inc)
        code)
      (when next?
        (swap! streams
               (fn [streams]
                 (-> streams
                     (assoc :code "n"
                            :pos 0
                            :out ""
                            :next? false)
                     (update :parsed conj (parse-stdout-into-map (:out streams))))))
        (stdin-code)))))

#_(do
    (.. prolog -FS (mkdir "wasm-preload"))
    (.. prolog -FS (mkdir "wasm-preload/library"))
    (.. prolog -FS (writeFile "wasm-preload/library/lists.pl" (str (.readFileSync (js/require "fs")
                                                                                  "wasm-preload/library/lists.pl"))))
    (.. prolog -prolog (call_string "use_module(library(lists))."))
    (query! "member(A, [1, 2, 2, 2, 3])."))

(defn stdout-code [char]
  (let [char (js/String.fromCharCode char)]
    (swap! streams #(-> %
                        (assoc :next? (and (not= char ".")
                                           (not= char "\n")))
                        (update :out str char)))))

(defn prepare-run [^js module]
  (.. module -FS (init stdin-code stdout-code)))

(.then (swi (clj->js {:arguments ["swipl"
                                  "-q"
                                  "-x" "/src/wasm-preload/boot.prc"
                                  "--nosignals"]
                      :noInitialRun true
                      :preRun #js [prepare-run]
                      :printErr #(swap! streams update :error str % "\n")}))

       #(do
          (defonce prolog %)))

(defn query! [code]
  (reset! streams {:code code :pos 0 :out "" :parsed []})
  (.. ^js prolog -prolog (call_string "break"))
  (if-let [error (:error @streams)]
    (throw (ex-info "Query failed!" {:error error}))
    (->> (-> @streams :out parse-stdout-into-map)
         (conj (:parsed @streams))
         (filter identity))))


(query! "assert(person(mauricio)).")
(query! "assert(person(szabo)).")

(query! "person(P).")
(query! "retract(person(_)).")
