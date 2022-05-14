var SWIPL = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
    function(SWIPL) {
      SWIPL = SWIPL || {};

      var Module = typeof SWIPL !== "undefined" ? SWIPL : {};
      var readyPromiseResolve, readyPromiseReject;
      Module["ready"] = new Promise(function(resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject
      });
      if (!Module.expectedDataFileDownloads) {
        Module.expectedDataFileDownloads = 0
      }
      Module.expectedDataFileDownloads++;
      (function() {
        if (Module["ENVIRONMENT_IS_PTHREAD"]) return;
        var loadPackage = function(metadata) {
          var PACKAGE_PATH = "";
          if (typeof window === "object") {
            PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/")
          } else if (typeof process === "undefined" && typeof location !== "undefined") {
            PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/")
          }
          var PACKAGE_NAME = "src/swipl-web.data";
          var REMOTE_PACKAGE_BASE = "swipl-web.data";
          if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
            Module["locateFile"] = Module["locateFilePackage"];
            err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")
          }
          var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
          var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
          var PACKAGE_UUID = metadata["package_uuid"];

          function fetchRemotePackage(packageName, packageSize, callback, errback) {
            if (typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string") {
              require("fs").readFile(packageName, function(err, contents) {
                if (err) {
                  errback(err)
                } else {
                  callback(contents.buffer)
                }
              });
              return
            }
            var xhr = new XMLHttpRequest;
            xhr.open("GET", packageName, true);
            xhr.responseType = "arraybuffer";
            xhr.onprogress = function(event) {
              var url = packageName;
              var size = packageSize;
              if (event.total) size = event.total;
              if (event.loaded) {
                if (!xhr.addedTotal) {
                  xhr.addedTotal = true;
                  if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                  Module.dataFileDownloads[url] = {
                    loaded: event.loaded,
                    total: size
                  }
                } else {
                  Module.dataFileDownloads[url].loaded = event.loaded
                }
                var total = 0;
                var loaded = 0;
                var num = 0;
                for (var download in Module.dataFileDownloads) {
                  var data = Module.dataFileDownloads[download];
                  total += data.total;
                  loaded += data.loaded;
                  num++
                }
                total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                if (Module["setStatus"]) Module["setStatus"]("Downloading data... (" + loaded + "/" + total + ")")
              } else if (!Module.dataFileDownloads) {
                if (Module["setStatus"]) Module["setStatus"]("Downloading data...")
              }
            };
            xhr.onerror = function(event) {
              throw new Error("NetworkError for: " + packageName)
            };
            xhr.onload = function(event) {
              if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
                var packageData = xhr.response;
                callback(packageData)
              } else {
                throw new Error(xhr.statusText + " : " + xhr.responseURL)
              }
            };
            xhr.send(null)
          }

          function handleError(error) {
            console.error("package error:", error)
          }
          var fetchedCallback = null;
          var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
          if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
            if (fetchedCallback) {
              fetchedCallback(data);
              fetchedCallback = null
            } else {
              fetched = data
            }
          }, handleError);

          function runWithFS() {
            function assert(check, msg) {
              if (!check) throw msg + (new Error).stack
            }
            Module["FS_createPath"]("/", "src", true, true);
            Module["FS_createPath"]("/src", "wasm-preload", true, true);
            Module["FS_createPath"]("/src/wasm-preload", "library", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "dialect", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "eclipse", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "yap", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "swi", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "sicstus4", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "iso", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "xsb", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "hprolog", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library/dialect", "sicstus", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "lynx", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "theme", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "iri_scheme", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "dcg", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "clp", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "build", true, true);
            Module["FS_createPath"]("/src/wasm-preload/library", "unicode", true, true);

            function DataRequest(start, end, audio) {
              this.start = start;
              this.end = end;
              this.audio = audio
            }
            DataRequest.prototype = {
              requests: {},
              open: function(mode, name) {
                this.name = name;
                this.requests[name] = this;
                Module["addRunDependency"]("fp " + this.name)
              },
              send: function() {},
              onload: function() {
                var byteArray = this.byteArray.subarray(this.start, this.end);
                this.finish(byteArray)
              },
              finish: function(byteArray) {
                var that = this;
                Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
                Module["removeRunDependency"]("fp " + that.name);
                this.requests[this.name] = null
              }
            };
            var files = metadata["files"];
            for (var i = 0; i < files.length; ++i) {
              new DataRequest(files[i]["start"], files[i]["end"], files[i]["audio"] || 0).open("GET", files[i]["filename"])
            }

            function processPackageData(arrayBuffer) {
              assert(arrayBuffer, "Loading data file failed.");
              assert(arrayBuffer instanceof ArrayBuffer, "bad input to processPackageData");
              var byteArray = new Uint8Array(arrayBuffer);
              DataRequest.prototype.byteArray = byteArray;
              var files = metadata["files"];
              for (var i = 0; i < files.length; ++i) {
                DataRequest.prototype.requests[files[i].filename].onload()
              }
              Module["removeRunDependency"]("datafile_src/swipl-web.data")
            }
            Module["addRunDependency"]("datafile_src/swipl-web.data");
            if (!Module.preloadResults) Module.preloadResults = {};
            Module.preloadResults[PACKAGE_NAME] = {
              fromCache: false
            };
            if (fetched) {
              processPackageData(fetched);
              fetched = null
            } else {
              fetchedCallback = processPackageData
            }
          }
          if (Module["calledRun"]) {
            runWithFS()
          } else {
            if (!Module["preRun"]) Module["preRun"] = [];
            Module["preRun"].push(runWithFS)
          }
        };
        loadPackage({
          "files": [{
            "filename": "/src/wasm-preload/boot.prc",
            "start": 0,
            "end": 105843
          }, {
            "filename": "/src/wasm-preload/library/lazy_lists.pl",
            "start": 105843,
            "end": 122343
          }, {
            "filename": "/src/wasm-preload/library/check.pl",
            "start": 122343,
            "end": 155840
          }, {
            "filename": "/src/wasm-preload/library/make.pl",
            "start": 155840,
            "end": 162460
          }, {
            "filename": "/src/wasm-preload/library/error.pl",
            "start": 162460,
            "end": 178336
          }, {
            "filename": "/src/wasm-preload/library/record.pl",
            "start": 178336,
            "end": 194944
          }, {
            "filename": "/src/wasm-preload/library/prolog_format.pl",
            "start": 194944,
            "end": 201807
          }, {
            "filename": "/src/wasm-preload/library/apply_macros.pl",
            "start": 201807,
            "end": 216690
          }, {
            "filename": "/src/wasm-preload/library/prolog_wrap.pl",
            "start": 216690,
            "end": 222094
          }, {
            "filename": "/src/wasm-preload/library/varnumbers.pl",
            "start": 222094,
            "end": 229235
          }, {
            "filename": "/src/wasm-preload/library/broadcast.pl",
            "start": 229235,
            "end": 234590
          }, {
            "filename": "/src/wasm-preload/library/operators.pl",
            "start": 234590,
            "end": 239834
          }, {
            "filename": "/src/wasm-preload/library/readln.pl",
            "start": 239834,
            "end": 248761
          }, {
            "filename": "/src/wasm-preload/library/system.pl",
            "start": 248761,
            "end": 252069
          }, {
            "filename": "/src/wasm-preload/library/rbtrees.pl",
            "start": 252069,
            "end": 289466
          }, {
            "filename": "/src/wasm-preload/library/prolog_versions.pl",
            "start": 289466,
            "end": 296391
          }, {
            "filename": "/src/wasm-preload/library/oset.pl",
            "start": 296391,
            "end": 301084
          }, {
            "filename": "/src/wasm-preload/library/dif.pl",
            "start": 301084,
            "end": 313721
          }, {
            "filename": "/src/wasm-preload/library/persistency.pl",
            "start": 313721,
            "end": 335640
          }, {
            "filename": "/src/wasm-preload/library/prolog_install.pl",
            "start": 335640,
            "end": 341422
          }, {
            "filename": "/src/wasm-preload/library/prolog_colour.pl",
            "start": 341422,
            "end": 444210
          }, {
            "filename": "/src/wasm-preload/library/atom.pl",
            "start": 444210,
            "end": 449632
          }, {
            "filename": "/src/wasm-preload/library/increval.pl",
            "start": 449632,
            "end": 456910
          }, {
            "filename": "/src/wasm-preload/library/tables.pl",
            "start": 456910,
            "end": 469521
          }, {
            "filename": "/src/wasm-preload/library/base64.pl",
            "start": 469521,
            "end": 481974
          }, {
            "filename": "/src/wasm-preload/library/qpforeign.pl",
            "start": 481974,
            "end": 504279
          }, {
            "filename": "/src/wasm-preload/library/tty.pl",
            "start": 504279,
            "end": 513554
          }, {
            "filename": "/src/wasm-preload/library/sandbox.pl",
            "start": 513554,
            "end": 556240
          }, {
            "filename": "/src/wasm-preload/library/terms.pl",
            "start": 556240,
            "end": 570933
          }, {
            "filename": "/src/wasm-preload/library/occurs.pl",
            "start": 570933,
            "end": 577764
          }, {
            "filename": "/src/wasm-preload/library/zip.pl",
            "start": 577764,
            "end": 585405
          }, {
            "filename": "/src/wasm-preload/library/writef.pl",
            "start": 585405,
            "end": 595326
          }, {
            "filename": "/src/wasm-preload/library/dicts.pl",
            "start": 595326,
            "end": 605982
          }, {
            "filename": "/src/wasm-preload/library/prolog_config.pl",
            "start": 605982,
            "end": 610790
          }, {
            "filename": "/src/wasm-preload/library/arithmetic.pl",
            "start": 610790,
            "end": 619876
          }, {
            "filename": "/src/wasm-preload/library/checklast.pl",
            "start": 619876,
            "end": 623132
          }, {
            "filename": "/src/wasm-preload/library/sort.pl",
            "start": 623132,
            "end": 626952
          }, {
            "filename": "/src/wasm-preload/library/check_installation.pl",
            "start": 626952,
            "end": 652211
          }, {
            "filename": "/src/wasm-preload/library/debug.pl",
            "start": 652211,
            "end": 665615
          }, {
            "filename": "/src/wasm-preload/library/optparse.pl",
            "start": 665615,
            "end": 703382
          }, {
            "filename": "/src/wasm-preload/library/modules.pl",
            "start": 703382,
            "end": 708231
          }, {
            "filename": "/src/wasm-preload/library/assoc.pl",
            "start": 708231,
            "end": 726558
          }, {
            "filename": "/src/wasm-preload/library/base32.pl",
            "start": 726558,
            "end": 734851
          }, {
            "filename": "/src/wasm-preload/library/www_browser.pl",
            "start": 734851,
            "end": 743151
          }, {
            "filename": "/src/wasm-preload/library/prolog_xref.pl",
            "start": 743151,
            "end": 835348
          }, {
            "filename": "/src/wasm-preload/library/backcomp.pl",
            "start": 835348,
            "end": 855245
          }, {
            "filename": "/src/wasm-preload/library/nb_rbtrees.pl",
            "start": 855245,
            "end": 863183
          }, {
            "filename": "/src/wasm-preload/library/readutil.pl",
            "start": 863183,
            "end": 874272
          }, {
            "filename": "/src/wasm-preload/library/prolog_code.pl",
            "start": 874272,
            "end": 886533
          }, {
            "filename": "/src/wasm-preload/library/console_input.pl",
            "start": 886533,
            "end": 890220
          }, {
            "filename": "/src/wasm-preload/library/prolog_stack.pl",
            "start": 890220,
            "end": 915995
          }, {
            "filename": "/src/wasm-preload/library/prolog_deps.pl",
            "start": 915995,
            "end": 933178
          }, {
            "filename": "/src/wasm-preload/library/hashtable.pl",
            "start": 933178,
            "end": 943502
          }, {
            "filename": "/src/wasm-preload/library/thread.pl",
            "start": 943502,
            "end": 971032
          }, {
            "filename": "/src/wasm-preload/library/prolog_metainference.pl",
            "start": 971032,
            "end": 980846
          }, {
            "filename": "/src/wasm-preload/library/qsave.pl",
            "start": 980846,
            "end": 1022740
          }, {
            "filename": "/src/wasm-preload/library/strings.pl",
            "start": 1022740,
            "end": 1038288
          }, {
            "filename": "/src/wasm-preload/library/predicate_options.pl",
            "start": 1038288,
            "end": 1069330
          }, {
            "filename": "/src/wasm-preload/library/statistics.pl",
            "start": 1069330,
            "end": 1093900
          }, {
            "filename": "/src/wasm-preload/library/prolog_pack.pl",
            "start": 1093900,
            "end": 1170772
          }, {
            "filename": "/src/wasm-preload/library/prolog_source.pl",
            "start": 1170772,
            "end": 1207536
          }, {
            "filename": "/src/wasm-preload/library/settings.pl",
            "start": 1207536,
            "end": 1231500
          }, {
            "filename": "/src/wasm-preload/library/listing.pl",
            "start": 1231500,
            "end": 1269297
          }, {
            "filename": "/src/wasm-preload/library/pairs.pl",
            "start": 1269297,
            "end": 1275161
          }, {
            "filename": "/src/wasm-preload/library/tabling.pl",
            "start": 1275161,
            "end": 1276961
          }, {
            "filename": "/src/wasm-preload/library/prolog_history.pl",
            "start": 1276961,
            "end": 1282826
          }, {
            "filename": "/src/wasm-preload/library/files.pl",
            "start": 1282826,
            "end": 1285583
          }, {
            "filename": "/src/wasm-preload/library/checkselect.pl",
            "start": 1285583,
            "end": 1288778
          }, {
            "filename": "/src/wasm-preload/library/pure_input.pl",
            "start": 1288778,
            "end": 1298650
          }, {
            "filename": "/src/wasm-preload/library/ctypes.pl",
            "start": 1298650,
            "end": 1303672
          }, {
            "filename": "/src/wasm-preload/library/vm.pl",
            "start": 1303672,
            "end": 1311797
          }, {
            "filename": "/src/wasm-preload/library/pprint.pl",
            "start": 1311797,
            "end": 1340021
          }, {
            "filename": "/src/wasm-preload/library/aggregate.pl",
            "start": 1340021,
            "end": 1364394
          }, {
            "filename": "/src/wasm-preload/library/main.pl",
            "start": 1364394,
            "end": 1394958
          }, {
            "filename": "/src/wasm-preload/library/yall.pl",
            "start": 1394958,
            "end": 1414468
          }, {
            "filename": "/src/wasm-preload/library/edit.pl",
            "start": 1414468,
            "end": 1433581
          }, {
            "filename": "/src/wasm-preload/library/option.pl",
            "start": 1433581,
            "end": 1446195
          }, {
            "filename": "/src/wasm-preload/library/dialect.pl",
            "start": 1446195,
            "end": 1450288
          }, {
            "filename": "/src/wasm-preload/library/utf8.pl",
            "start": 1450288,
            "end": 1454893
          }, {
            "filename": "/src/wasm-preload/library/portray_text.pl",
            "start": 1454893,
            "end": 1463635
          }, {
            "filename": "/src/wasm-preload/library/when.pl",
            "start": 1463635,
            "end": 1471392
          }, {
            "filename": "/src/wasm-preload/library/obfuscate.pl",
            "start": 1471392,
            "end": 1475514
          }, {
            "filename": "/src/wasm-preload/library/charsio.pl",
            "start": 1475514,
            "end": 1482150
          }, {
            "filename": "/src/wasm-preload/library/prolog_debug.pl",
            "start": 1482150,
            "end": 1491103
          }, {
            "filename": "/src/wasm-preload/library/git.pl",
            "start": 1491103,
            "end": 1519102
          }, {
            "filename": "/src/wasm-preload/library/coinduction.pl",
            "start": 1519102,
            "end": 1525162
          }, {
            "filename": "/src/wasm-preload/library/prolog_codewalk.pl",
            "start": 1525162,
            "end": 1564624
          }, {
            "filename": "/src/wasm-preload/library/date.pl",
            "start": 1564624,
            "end": 1574076
          }, {
            "filename": "/src/wasm-preload/library/thread_pool.pl",
            "start": 1574076,
            "end": 1590957
          }, {
            "filename": "/src/wasm-preload/library/solution_sequences.pl",
            "start": 1590957,
            "end": 1603209
          }, {
            "filename": "/src/wasm-preload/library/pio.pl",
            "start": 1603209,
            "end": 1605136
          }, {
            "filename": "/src/wasm-preload/library/prolog_trace.pl",
            "start": 1605136,
            "end": 1612795
          }, {
            "filename": "/src/wasm-preload/library/csv.pl",
            "start": 1612795,
            "end": 1631616
          }, {
            "filename": "/src/wasm-preload/library/.created",
            "start": 1631616,
            "end": 1631616
          }, {
            "filename": "/src/wasm-preload/library/ugraphs.pl",
            "start": 1631616,
            "end": 1652080
          }, {
            "filename": "/src/wasm-preload/library/iostream.pl",
            "start": 1652080,
            "end": 1660857
          }, {
            "filename": "/src/wasm-preload/library/codesio.pl",
            "start": 1660857,
            "end": 1667306
          }, {
            "filename": "/src/wasm-preload/library/explain.pl",
            "start": 1667306,
            "end": 1681501
          }, {
            "filename": "/src/wasm-preload/library/random.pl",
            "start": 1681501,
            "end": 1694950
          }, {
            "filename": "/src/wasm-preload/library/ansi_term.pl",
            "start": 1694950,
            "end": 1713643
          }, {
            "filename": "/src/wasm-preload/library/hotfix.pl",
            "start": 1713643,
            "end": 1721525
          }, {
            "filename": "/src/wasm-preload/library/gensym.pl",
            "start": 1721525,
            "end": 1725539
          }, {
            "filename": "/src/wasm-preload/library/shell.pl",
            "start": 1725539,
            "end": 1736244
          }, {
            "filename": "/src/wasm-preload/library/prolog_breakpoints.pl",
            "start": 1736244,
            "end": 1747320
          }, {
            "filename": "/src/wasm-preload/library/quintus.pl",
            "start": 1747320,
            "end": 1760413
          }, {
            "filename": "/src/wasm-preload/library/url.pl",
            "start": 1760413,
            "end": 1788566
          }, {
            "filename": "/src/wasm-preload/library/lists.pl",
            "start": 1788566,
            "end": 1812807
          }, {
            "filename": "/src/wasm-preload/library/prolog_clause.pl",
            "start": 1812807,
            "end": 1847150
          }, {
            "filename": "/src/wasm-preload/library/edinburgh.pl",
            "start": 1847150,
            "end": 1851655
          }, {
            "filename": "/src/wasm-preload/library/shlib.pl",
            "start": 1851655,
            "end": 1871517
          }, {
            "filename": "/src/wasm-preload/library/wfs.pl",
            "start": 1871517,
            "end": 1878438
          }, {
            "filename": "/src/wasm-preload/library/prolog_autoload.pl",
            "start": 1878438,
            "end": 1886987
          }, {
            "filename": "/src/wasm-preload/library/nb_set.pl",
            "start": 1886987,
            "end": 1892653
          }, {
            "filename": "/src/wasm-preload/library/intercept.pl",
            "start": 1892653,
            "end": 1901275
          }, {
            "filename": "/src/wasm-preload/library/prolog_jiti.pl",
            "start": 1901275,
            "end": 1906460
          }, {
            "filename": "/src/wasm-preload/library/quasi_quotations.pl",
            "start": 1906460,
            "end": 1917846
          }, {
            "filename": "/src/wasm-preload/library/heaps.pl",
            "start": 1917846,
            "end": 1926123
          }, {
            "filename": "/src/wasm-preload/library/apply.pl",
            "start": 1926123,
            "end": 1939919
          }, {
            "filename": "/src/wasm-preload/library/fastrw.pl",
            "start": 1939919,
            "end": 1944308
          }, {
            "filename": "/src/wasm-preload/library/threadutil.pl",
            "start": 1944308,
            "end": 1959611
          }, {
            "filename": "/src/wasm-preload/library/ordsets.pl",
            "start": 1959611,
            "end": 1976104
          }, {
            "filename": "/src/wasm-preload/library/dialect/bim.pl",
            "start": 1976104,
            "end": 1980385
          }, {
            "filename": "/src/wasm-preload/library/dialect/hprolog.pl",
            "start": 1980385,
            "end": 1988777
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4.pl",
            "start": 1988777,
            "end": 1996164
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb.pl",
            "start": 1996164,
            "end": 2017407
          }, {
            "filename": "/src/wasm-preload/library/dialect/yap.pl",
            "start": 2017407,
            "end": 2024541
          }, {
            "filename": "/src/wasm-preload/library/dialect/.created",
            "start": 2024541,
            "end": 2024541
          }, {
            "filename": "/src/wasm-preload/library/dialect/commons.pl",
            "start": 2024541,
            "end": 2027101
          }, {
            "filename": "/src/wasm-preload/library/dialect/ifprolog.pl",
            "start": 2027101,
            "end": 2063558
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus.pl",
            "start": 2063558,
            "end": 2080380
          }, {
            "filename": "/src/wasm-preload/library/dialect/eclipse/test_util_iso.pl",
            "start": 2080380,
            "end": 2090232
          }, {
            "filename": "/src/wasm-preload/library/dialect/eclipse/.created",
            "start": 2090232,
            "end": 2090232
          }, {
            "filename": "/src/wasm-preload/library/dialect/yap/README.TXT",
            "start": 2090232,
            "end": 2090583
          }, {
            "filename": "/src/wasm-preload/library/dialect/yap/.created",
            "start": 2090583,
            "end": 2090583
          }, {
            "filename": "/src/wasm-preload/library/dialect/swi/syspred_options.pl",
            "start": 2090583,
            "end": 2098450
          }, {
            "filename": "/src/wasm-preload/library/dialect/swi/.created",
            "start": 2098450,
            "end": 2098450
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/clpfd.pl",
            "start": 2098450,
            "end": 2100990
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/system.pl",
            "start": 2100990,
            "end": 2103903
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/terms.pl",
            "start": 2103903,
            "end": 2106795
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/types.pl",
            "start": 2106795,
            "end": 2111088
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/sets.pl",
            "start": 2111088,
            "end": 2114634
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/samsort.pl",
            "start": 2114634,
            "end": 2117596
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/aggregate.pl",
            "start": 2117596,
            "end": 2120016
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/sockets.pl",
            "start": 2120016,
            "end": 2126213
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/timeout.pl",
            "start": 2126213,
            "end": 2127993
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/between.pl",
            "start": 2127993,
            "end": 2130122
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/.created",
            "start": 2130122,
            "end": 2130122
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/file_systems.pl",
            "start": 2130122,
            "end": 2147605
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/lists.pl",
            "start": 2147605,
            "end": 2155597
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus4/ordsets.pl",
            "start": 2155597,
            "end": 2157619
          }, {
            "filename": "/src/wasm-preload/library/dialect/iso/iso_predicates.pl",
            "start": 2157619,
            "end": 2167309
          }, {
            "filename": "/src/wasm-preload/library/dialect/iso/.created",
            "start": 2167309,
            "end": 2167309
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/string.pl",
            "start": 2167309,
            "end": 2169863
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/README.md",
            "start": 2169863,
            "end": 2170514
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/machine.pl",
            "start": 2170514,
            "end": 2177556
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/source.pl",
            "start": 2177556,
            "end": 2187352
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/setof.pl",
            "start": 2187352,
            "end": 2189891
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/error_handler.pl",
            "start": 2189891,
            "end": 2194088
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/gpp.pl",
            "start": 2194088,
            "end": 2199152
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/thread.pl",
            "start": 2199152,
            "end": 2201337
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/storage.pl",
            "start": 2201337,
            "end": 2203907
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/intern.pl",
            "start": 2203907,
            "end": 2205829
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/timed_call.pl",
            "start": 2205829,
            "end": 2211568
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/basics.pl",
            "start": 2211568,
            "end": 2218935
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/.created",
            "start": 2218935,
            "end": 2218935
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/consult.pl",
            "start": 2218935,
            "end": 2220777
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/curr_sym.pl",
            "start": 2220777,
            "end": 2223040
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/gensym.pl",
            "start": 2223040,
            "end": 2225082
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/lists.pl",
            "start": 2225082,
            "end": 2226980
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/standard.pl",
            "start": 2226980,
            "end": 2231785
          }, {
            "filename": "/src/wasm-preload/library/dialect/xsb/ordsets.pl",
            "start": 2231785,
            "end": 2234007
          }, {
            "filename": "/src/wasm-preload/library/dialect/hprolog/format.pl",
            "start": 2234007,
            "end": 2235844
          }, {
            "filename": "/src/wasm-preload/library/dialect/hprolog/.created",
            "start": 2235844,
            "end": 2235844
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/system.pl",
            "start": 2235844,
            "end": 2242419
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/swipl-lfr.pl",
            "start": 2242419,
            "end": 2246419
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/terms.pl",
            "start": 2246419,
            "end": 2248658
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/block.pl",
            "start": 2248658,
            "end": 2259101
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/arrays.pl",
            "start": 2259101,
            "end": 2262805
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/sockets.pl",
            "start": 2262805,
            "end": 2269024
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/timeout.pl",
            "start": 2269024,
            "end": 2272775
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/README.TXT",
            "start": 2272775,
            "end": 2272806
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/.created",
            "start": 2272806,
            "end": 2272806
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/lists.pl",
            "start": 2272806,
            "end": 2277463
          }, {
            "filename": "/src/wasm-preload/library/dialect/sicstus/ordsets.pl",
            "start": 2277463,
            "end": 2279417
          }, {
            "filename": "/src/wasm-preload/library/lynx/format.pl",
            "start": 2279417,
            "end": 2290208
          }, {
            "filename": "/src/wasm-preload/library/lynx/html_text.pl",
            "start": 2290208,
            "end": 2314946
          }, {
            "filename": "/src/wasm-preload/library/lynx/pldoc_style.pl",
            "start": 2314946,
            "end": 2318191
          }, {
            "filename": "/src/wasm-preload/library/lynx/.created",
            "start": 2318191,
            "end": 2318191
          }, {
            "filename": "/src/wasm-preload/library/lynx/html_style.pl",
            "start": 2318191,
            "end": 2322672
          }, {
            "filename": "/src/wasm-preload/library/theme/dark.pl",
            "start": 2322672,
            "end": 2334576
          }, {
            "filename": "/src/wasm-preload/library/theme/auto.pl",
            "start": 2334576,
            "end": 2336801
          }, {
            "filename": "/src/wasm-preload/library/theme/.created",
            "start": 2336801,
            "end": 2336801
          }, {
            "filename": "/src/wasm-preload/library/iri_scheme/file.pl",
            "start": 2336801,
            "end": 2339626
          }, {
            "filename": "/src/wasm-preload/library/iri_scheme/.created",
            "start": 2339626,
            "end": 2339626
          }, {
            "filename": "/src/wasm-preload/library/dcg/high_order.pl",
            "start": 2339626,
            "end": 2347102
          }, {
            "filename": "/src/wasm-preload/library/dcg/basics.pl",
            "start": 2347102,
            "end": 2357983
          }, {
            "filename": "/src/wasm-preload/library/dcg/.created",
            "start": 2357983,
            "end": 2357983
          }, {
            "filename": "/src/wasm-preload/library/clp/clpfd.pl",
            "start": 2357983,
            "end": 2634837
          }, {
            "filename": "/src/wasm-preload/library/clp/clp_distinct.pl",
            "start": 2634837,
            "end": 2641435
          }, {
            "filename": "/src/wasm-preload/library/clp/bounds.pl",
            "start": 2641435,
            "end": 2680744
          }, {
            "filename": "/src/wasm-preload/library/clp/clp_events.pl",
            "start": 2680744,
            "end": 2683456
          }, {
            "filename": "/src/wasm-preload/library/clp/.created",
            "start": 2683456,
            "end": 2683456
          }, {
            "filename": "/src/wasm-preload/library/clp/clpb.pl",
            "start": 2683456,
            "end": 2749508
          }, {
            "filename": "/src/wasm-preload/library/build/make.pl",
            "start": 2749508,
            "end": 2755510
          }, {
            "filename": "/src/wasm-preload/library/build/conan.pl",
            "start": 2755510,
            "end": 2762505
          }, {
            "filename": "/src/wasm-preload/library/build/tools.pl",
            "start": 2762505,
            "end": 2788779
          }, {
            "filename": "/src/wasm-preload/library/build/cmake.pl",
            "start": 2788779,
            "end": 2793636
          }, {
            "filename": "/src/wasm-preload/library/build/.created",
            "start": 2793636,
            "end": 2793636
          }, {
            "filename": "/src/wasm-preload/library/unicode/blocks.pl",
            "start": 2793636,
            "end": 2803877
          }, {
            "filename": "/src/wasm-preload/library/unicode/.created",
            "start": 2803877,
            "end": 2803877
          }, {
            "filename": "/src/wasm-preload/library/unicode/unicode_data.pl",
            "start": 2803877,
            "end": 2809326
          }],
          "remote_package_size": 2809326,
          "package_uuid": "3f0227bd-f84c-4841-bc54-4f847e163141"
        })
      })();
      var moduleOverrides = Object.assign({}, Module);
      var arguments_ = [];
      var thisProgram = "./this.program";
      var quit_ = (status, toThrow) => {
        throw toThrow
      };
      var ENVIRONMENT_IS_WEB = typeof window === "object";
      var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
      var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
      var scriptDirectory = "";

      function locateFile(path) {
        if (Module["locateFile"]) {
          return Module["locateFile"](path, scriptDirectory)
        }
        return scriptDirectory + path
      }
      var read_, readAsync, readBinary, setWindowTitle;

      function logExceptionOnExit(e) {
        if (e instanceof ExitStatus) return;
        let toLog = e;
        err("exiting due to exception: " + toLog)
      }
      var fs;
      var nodePath;
      var requireNodeFS;
      if (ENVIRONMENT_IS_NODE) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = require("path").dirname(scriptDirectory) + "/"
        } else {
          scriptDirectory = __dirname + "/"
        }
        requireNodeFS = (() => {
          if (!nodePath) {
            fs = require("fs");
            nodePath = require("path")
          }
        });
        read_ = function shell_read(filename, binary) {
          requireNodeFS();
          filename = nodePath["normalize"](filename);
          return fs.readFileSync(filename, binary ? undefined : "utf8")
        };
        readBinary = (filename => {
          var ret = read_(filename, true);
          if (!ret.buffer) {
            ret = new Uint8Array(ret)
          }
          return ret
        });
        readAsync = ((filename, onload, onerror) => {
          requireNodeFS();
          filename = nodePath["normalize"](filename);
          fs.readFile(filename, function(err, data) {
            if (err) onerror(err);
            else onload(data.buffer)
          })
        });
        if (process["argv"].length > 1) {
          thisProgram = process["argv"][1].replace(/\\/g, "/")
        }
        arguments_ = process["argv"].slice(2);
        process["on"]("uncaughtException", function(ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex
          }
        });
        process["on"]("unhandledRejection", function(reason) {
          throw reason
        });
        quit_ = ((status, toThrow) => {
          if (keepRuntimeAlive()) {
            process["exitCode"] = status;
            throw toThrow
          }
          logExceptionOnExit(toThrow);
          process["exit"](status)
        });
        Module["inspect"] = function() {
          return "[Emscripten Module object]"
        }
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href
        } else if (typeof document !== "undefined" && document.currentScript) {
          scriptDirectory = document.currentScript.src
        }
        if (_scriptDir) {
          scriptDirectory = _scriptDir
        }
        if (scriptDirectory.indexOf("blob:") !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
        } else {
          scriptDirectory = ""
        } {
          read_ = (url => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText
          });
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = (url => {
              var xhr = new XMLHttpRequest;
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response)
            })
          }
          readAsync = ((url, onload, onerror) => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = (() => {
              if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return
              }
              onerror()
            });
            xhr.onerror = onerror;
            xhr.send(null)
          })
        }
        setWindowTitle = (title => document.title = title)
      } else {}
      var out = Module["print"] || console.log.bind(console);
      var err = Module["printErr"] || console.warn.bind(console);
      Object.assign(Module, moduleOverrides);
      moduleOverrides = null;
      if (Module["arguments"]) arguments_ = Module["arguments"];
      if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
      if (Module["quit"]) quit_ = Module["quit"];
      var tempRet0 = 0;
      var setTempRet0 = value => {
        tempRet0 = value
      };
      var getTempRet0 = () => tempRet0;
      var wasmBinary;
      if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
      var noExitRuntime = Module["noExitRuntime"] || false;
      if (typeof WebAssembly !== "object") {
        abort("no native wasm support detected")
      }

      function setValue(ptr, value, type = "i8", noSafe) {
        if (type.charAt(type.length - 1) === "*") type = "i32";
        switch (type) {
          case "i1":
            HEAP8[ptr >> 0] = value;
            break;
          case "i8":
            HEAP8[ptr >> 0] = value;
            break;
          case "i16":
            HEAP16[ptr >> 1] = value;
            break;
          case "i32":
            HEAP32[ptr >> 2] = value;
            break;
          case "i64":
            tempI64 = [value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
            break;
          case "float":
            HEAPF32[ptr >> 2] = value;
            break;
          case "double":
            HEAPF64[ptr >> 3] = value;
            break;
          default:
            abort("invalid type for setValue: " + type)
        }
      }

      function getValue(ptr, type = "i8", noSafe) {
        if (type.charAt(type.length - 1) === "*") type = "i32";
        switch (type) {
          case "i1":
            return HEAP8[ptr >> 0];
          case "i8":
            return HEAP8[ptr >> 0];
          case "i16":
            return HEAP16[ptr >> 1];
          case "i32":
            return HEAP32[ptr >> 2];
          case "i64":
            return HEAP32[ptr >> 2];
          case "float":
            return HEAPF32[ptr >> 2];
          case "double":
            return Number(HEAPF64[ptr >> 3]);
          default:
            abort("invalid type for getValue: " + type)
        }
        return null
      }
      var wasmMemory;
      var ABORT = false;
      var EXITSTATUS;

      function assert(condition, text) {
        if (!condition) {
          abort(text)
        }
      }

      function getCFunc(ident) {
        var func = Module["_" + ident];
        return func
      }

      function ccall(ident, returnType, argTypes, args, opts) {
        var toC = {
          "string": function(str) {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
              var len = (str.length << 2) + 1;
              ret = stackAlloc(len);
              stringToUTF8(str, ret, len)
            }
            return ret
          },
          "array": function(arr) {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret
          }
        };

        function convertReturnValue(ret) {
          if (returnType === "string") return UTF8ToString(ret);
          if (returnType === "boolean") return Boolean(ret);
          return ret
        }
        var func = getCFunc(ident);
        var cArgs = [];
        var stack = 0;
        if (args) {
          for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
              if (stack === 0) stack = stackSave();
              cArgs[i] = converter(args[i])
            } else {
              cArgs[i] = args[i]
            }
          }
        }
        var ret = func.apply(null, cArgs);

        function onDone(ret) {
          if (stack !== 0) stackRestore(stack);
          return convertReturnValue(ret)
        }
        ret = onDone(ret);
        return ret
      }

      function cwrap(ident, returnType, argTypes, opts) {
        argTypes = argTypes || [];
        var numericArgs = argTypes.every(function(type) {
          return type === "number"
        });
        var numericRet = returnType !== "string";
        if (numericRet && numericArgs && !opts) {
          return getCFunc(ident)
        }
        return function() {
          return ccall(ident, returnType, argTypes, arguments, opts)
        }
      }
      var ALLOC_NORMAL = 0;
      var ALLOC_STACK = 1;

      function allocate(slab, allocator) {
        var ret;
        if (allocator == ALLOC_STACK) {
          ret = stackAlloc(slab.length)
        } else {
          ret = _malloc(slab.length)
        }
        if (!slab.subarray && !slab.slice) {
          slab = new Uint8Array(slab)
        }
        HEAPU8.set(slab, ret);
        return ret
      }
      var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

      function UTF8ArrayToString(heap, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
        if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
          return UTF8Decoder.decode(heap.subarray(idx, endPtr))
        } else {
          var str = "";
          while (idx < endPtr) {
            var u0 = heap[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0)
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
          }
        }
        return str
      }

      function UTF8ToString(ptr, maxBytesToRead) {
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
      }

      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
          }
          if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
          } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
          }
        }
        heap[outIdx] = 0;
        return outIdx - startIdx
      }

      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
      }

      function lengthBytesUTF8(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
          if (u <= 127) ++len;
          else if (u <= 2047) len += 2;
          else if (u <= 65535) len += 3;
          else len += 4
        }
        return len
      }

      function allocateUTF8(str) {
        var size = lengthBytesUTF8(str) + 1;
        var ret = _malloc(size);
        if (ret) stringToUTF8Array(str, HEAP8, ret, size);
        return ret
      }

      function writeArrayToMemory(array, buffer) {
        HEAP8.set(array, buffer)
      }

      function writeAsciiToMemory(str, buffer, dontAddNull) {
        for (var i = 0; i < str.length; ++i) {
          HEAP8[buffer++ >> 0] = str.charCodeAt(i)
        }
        if (!dontAddNull) HEAP8[buffer >> 0] = 0
      }
      var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

      function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module["HEAP8"] = HEAP8 = new Int8Array(buf);
        Module["HEAP16"] = HEAP16 = new Int16Array(buf);
        Module["HEAP32"] = HEAP32 = new Int32Array(buf);
        Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
        Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
        Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
        Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
        Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
      }
      var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
      var wasmTable;
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATEXIT__ = [];
      var __ATPOSTRUN__ = [];
      var runtimeInitialized = false;
      var runtimeExited = false;
      var runtimeKeepaliveCounter = 0;

      function keepRuntimeAlive() {
        return noExitRuntime || runtimeKeepaliveCounter > 0
      }

      function preRun() {
        if (Module["preRun"]) {
          if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
          while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
          }
        }
        callRuntimeCallbacks(__ATPRERUN__)
      }

      function initRuntime() {
        runtimeInitialized = true;
        if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
        FS.ignorePermissions = false;
        TTY.init();
        callRuntimeCallbacks(__ATINIT__)
      }

      function exitRuntime() {
        ___funcs_on_exit();
        callRuntimeCallbacks(__ATEXIT__);
        FS.quit();
        TTY.shutdown();
        runtimeExited = true
      }

      function postRun() {
        if (Module["postRun"]) {
          if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
          while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__)
      }

      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb)
      }

      function addOnInit(cb) {
        __ATINIT__.unshift(cb)
      }

      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb)
      }
      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null;

      function getUniqueRunDependency(id) {
        return id
      }

      function addRunDependency(id) {
        runDependencies++;
        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies)
        }
      }

      function removeRunDependency(id) {
        runDependencies--;
        if (Module["monitorRunDependencies"]) {
          Module["monitorRunDependencies"](runDependencies)
        }
        if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
          }
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
          }
        }
      }
      Module["preloadedImages"] = {};
      Module["preloadedAudios"] = {};

      function abort(what) {
        {
          if (Module["onAbort"]) {
            Module["onAbort"](what)
          }
        }
        what = "Aborted(" + what + ")";
        err(what);
        ABORT = true;
        EXITSTATUS = 1;
        what += ". Build with -s ASSERTIONS=1 for more info.";
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e
      }
      var dataURIPrefix = "data:application/octet-stream;base64,";

      function isDataURI(filename) {
        return filename.startsWith(dataURIPrefix)
      }

      function isFileURI(filename) {
        return filename.startsWith("file://")
      }
      var wasmBinaryFile;
      wasmBinaryFile = "swipl-web.wasm";
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile)
      }

      function getBinary(file) {
        try {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary)
          }
          if (readBinary) {
            return readBinary(file)
          } else {
            throw "both async and sync fetching of the wasm failed"
          }
        } catch (err) {
          abort(err)
        }
      }

      function getBinaryPromise() {
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
          if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, {
              credentials: "same-origin"
            }).then(function(response) {
              if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
              }
              return response["arrayBuffer"]()
            }).catch(function() {
              return getBinary(wasmBinaryFile)
            })
          } else {
            if (readAsync) {
              return new Promise(function(resolve, reject) {
                readAsync(wasmBinaryFile, function(response) {
                  resolve(new Uint8Array(response))
                }, reject)
              })
            }
          }
        }
        return Promise.resolve().then(function() {
          return getBinary(wasmBinaryFile)
        })
      }

      function createWasm() {
        var info = {
          "a": asmLibraryArg
        };

        function receiveInstance(instance, module) {
          var exports = instance.exports;
          Module["asm"] = exports;
          wasmMemory = Module["asm"]["na"];
          updateGlobalBufferAndViews(wasmMemory.buffer);
          wasmTable = Module["asm"]["Jb"];
          addOnInit(Module["asm"]["oa"]);
          removeRunDependency("wasm-instantiate")
        }
        addRunDependency("wasm-instantiate");

        function receiveInstantiationResult(result) {
          receiveInstance(result["instance"])
        }

        function instantiateArrayBuffer(receiver) {
          return getBinaryPromise().then(function(binary) {
            return WebAssembly.instantiate(binary, info)
          }).then(function(instance) {
            return instance
          }).then(receiver, function(reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason)
          })
        }

        function instantiateAsync() {
          if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
            return fetch(wasmBinaryFile, {
              credentials: "same-origin"
            }).then(function(response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function(reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(receiveInstantiationResult)
              })
            })
          } else {
            return instantiateArrayBuffer(receiveInstantiationResult)
          }
        }
        if (Module["instantiateWasm"]) {
          try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports
          } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
          }
        }
        instantiateAsync().catch(readyPromiseReject);
        return {}
      }
      var tempDouble;
      var tempI64;

      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          var callback = callbacks.shift();
          if (typeof callback == "function") {
            callback(Module);
            continue
          }
          var func = callback.func;
          if (typeof func === "number") {
            if (callback.arg === undefined) {
              getWasmTableEntry(func)()
            } else {
              getWasmTableEntry(func)(callback.arg)
            }
          } else {
            func(callback.arg === undefined ? null : callback.arg)
          }
        }
      }
      var wasmTableMirror = [];

      function getWasmTableEntry(funcPtr) {
        var func = wasmTableMirror[funcPtr];
        if (!func) {
          if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
          wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr)
        }
        return func
      }
      var PATH = {
        splitPath: function(filename) {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1)
        },
        normalizeArray: function(parts, allowAboveRoot) {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1)
            } else if (last === "..") {
              parts.splice(i, 1);
              up++
            } else if (up) {
              parts.splice(i, 1);
              up--
            }
          }
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift("..")
            }
          }
          return parts
        },
        normalize: function(path) {
          var isAbsolute = path.charAt(0) === "/",
            trailingSlash = path.substr(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p
          }), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = "."
          }
          if (path && trailingSlash) {
            path += "/"
          }
          return (isAbsolute ? "/" : "") + path
        },
        dirname: function(path) {
          var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
          if (!root && !dir) {
            return "."
          }
          if (dir) {
            dir = dir.substr(0, dir.length - 1)
          }
          return root + dir
        },
        basename: function(path) {
          if (path === "/") return "/";
          path = PATH.normalize(path);
          path = path.replace(/\/$/, "");
          var lastSlash = path.lastIndexOf("/");
          if (lastSlash === -1) return path;
          return path.substr(lastSlash + 1)
        },
        extname: function(path) {
          return PATH.splitPath(path)[3]
        },
        join: function() {
          var paths = Array.prototype.slice.call(arguments, 0);
          return PATH.normalize(paths.join("/"))
        },
        join2: function(l, r) {
          return PATH.normalize(l + "/" + r)
        }
      };

      function getRandomDevice() {
        if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
          var randomBuffer = new Uint8Array(1);
          return function() {
            crypto.getRandomValues(randomBuffer);
            return randomBuffer[0]
          }
        } else if (ENVIRONMENT_IS_NODE) {
          try {
            var crypto_module = require("crypto");
            return function() {
              return crypto_module["randomBytes"](1)[0]
            }
          } catch (e) {}
        }
        return function() {
          abort("randomDevice")
        }
      }
      var PATH_FS = {
        resolve: function() {
          var resolvedPath = "",
            resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
              throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
              return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/"
          }
          resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
            return !!p
          }), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
        },
        relative: function(from, to) {
          from = PATH_FS.resolve(from).substr(1);
          to = PATH_FS.resolve(to).substr(1);

          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "") break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "") break
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1)
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/")
        }
      };
      var TTY = {
        ttys: [],
        init: function() {},
        shutdown: function() {},
        register: function(dev, ops) {
          TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
          };
          FS.registerDevice(dev, TTY.stream_ops)
        },
        stream_ops: {
          open: function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
              throw new FS.ErrnoError(43)
            }
            stream.tty = tty;
            stream.seekable = false
          },
          close: function(stream) {
            stream.tty.ops.flush(stream.tty)
          },
          flush: function(stream) {
            stream.tty.ops.flush(stream.tty)
          },
          read: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
              throw new FS.ErrnoError(60)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = stream.tty.ops.get_char(stream.tty)
              } catch (e) {
                throw new FS.ErrnoError(29)
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6)
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset + i] = result
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now()
            }
            return bytesRead
          },
          write: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
              throw new FS.ErrnoError(60)
            }
            try {
              for (var i = 0; i < length; i++) {
                stream.tty.ops.put_char(stream.tty, buffer[offset + i])
              }
            } catch (e) {
              throw new FS.ErrnoError(29)
            }
            if (length) {
              stream.node.timestamp = Date.now()
            }
            return i
          }
        },
        default_tty_ops: {
          get_char: function(tty) {
            if (!tty.input.length) {
              var result = null;
              if (ENVIRONMENT_IS_NODE) {
                var BUFSIZE = 256;
                var buf = Buffer.alloc(BUFSIZE);
                var bytesRead = 0;
                try {
                  bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1)
                } catch (e) {
                  if (e.toString().includes("EOF")) bytesRead = 0;
                  else throw e
                }
                if (bytesRead > 0) {
                  result = buf.slice(0, bytesRead).toString("utf-8")
                } else {
                  result = null
                }
              } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                result = window.prompt("Input: ");
                if (result !== null) {
                  result += "\n"
                }
              } else if (typeof readline == "function") {
                result = readline();
                if (result !== null) {
                  result += "\n"
                }
              }
              if (!result) {
                return null
              }
              tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
          },
          put_char: function(tty, val) {
            if (val === null || val === 10) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            } else {
              if (val != 0) tty.output.push(val)
            }
          },
          flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
              out(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            }
          }
        },
        default_tty1_ops: {
          put_char: function(tty, val) {
            if (val === null || val === 10) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            } else {
              if (val != 0) tty.output.push(val)
            }
          },
          flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
              err(UTF8ArrayToString(tty.output, 0));
              tty.output = []
            }
          }
        }
      };

      function zeroMemory(address, size) {
        HEAPU8.fill(0, address, address + size)
      }

      function alignMemory(size, alignment) {
        return Math.ceil(size / alignment) * alignment
      }

      function mmapAlloc(size) {
        size = alignMemory(size, 65536);
        var ptr = _memalign(65536, size);
        if (!ptr) return 0;
        zeroMemory(ptr, size);
        return ptr
      }
      var MEMFS = {
        ops_table: null,
        mount: function(mount) {
          return MEMFS.createNode(null, "/", 16384 | 511, 0)
        },
        createNode: function(parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63)
          }
          if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              }
            }
          }
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
          }
          node.timestamp = Date.now();
          if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp
          }
          return node
        },
        getFileDataAsTypedArray: function(node) {
          if (!node.contents) return new Uint8Array(0);
          if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
          return new Uint8Array(node.contents)
        },
        expandFileStorage: function(node, newCapacity) {
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return;
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity);
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0)
        },
        resizeFileStorage: function(node, newSize) {
          if (node.usedBytes == newSize) return;
          if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0
          } else {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize
          }
        },
        node_ops: {
          getattr: function(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
              attr.size = 4096
            } else if (FS.isFile(node.mode)) {
              attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
              attr.size = node.link.length
            } else {
              attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
          },
          setattr: function(node, attr) {
            if (attr.mode !== undefined) {
              node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
              node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
              MEMFS.resizeFileStorage(node, attr.size)
            }
          },
          lookup: function(parent, name) {
            throw FS.genericErrors[44]
          },
          mknod: function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
          },
          rename: function(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
              var new_node;
              try {
                new_node = FS.lookupNode(new_dir, new_name)
              } catch (e) {}
              if (new_node) {
                for (var i in new_node.contents) {
                  throw new FS.ErrnoError(55)
                }
              }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.parent.timestamp = Date.now();
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            new_dir.timestamp = old_node.parent.timestamp;
            old_node.parent = new_dir
          },
          unlink: function(parent, name) {
            delete parent.contents[name];
            parent.timestamp = Date.now()
          },
          rmdir: function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
              throw new FS.ErrnoError(55)
            }
            delete parent.contents[name];
            parent.timestamp = Date.now()
          },
          readdir: function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
              if (!node.contents.hasOwnProperty(key)) {
                continue
              }
              entries.push(key)
            }
            return entries
          },
          symlink: function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
          },
          readlink: function(node) {
            if (!FS.isLink(node.mode)) {
              throw new FS.ErrnoError(28)
            }
            return node.link
          }
        },
        stream_ops: {
          read: function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            if (size > 8 && contents.subarray) {
              buffer.set(contents.subarray(position, position + size), offset)
            } else {
              for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
            }
            return size
          },
          write: function(stream, buffer, offset, length, position, canOwn) {
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
              if (canOwn) {
                node.contents = buffer.subarray(offset, offset + length);
                node.usedBytes = length;
                return length
              } else if (node.usedBytes === 0 && position === 0) {
                node.contents = buffer.slice(offset, offset + length);
                node.usedBytes = length;
                return length
              } else if (position + length <= node.usedBytes) {
                node.contents.set(buffer.subarray(offset, offset + length), position);
                return length
              }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) {
              node.contents.set(buffer.subarray(offset, offset + length), position)
            } else {
              for (var i = 0; i < length; i++) {
                node.contents[position + i] = buffer[offset + i]
              }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
          },
          llseek: function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
              position += stream.position
            } else if (whence === 2) {
              if (FS.isFile(stream.node.mode)) {
                position += stream.node.usedBytes
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(28)
            }
            return position
          },
          allocate: function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
          },
          mmap: function(stream, address, length, position, prot, flags) {
            if (address !== 0) {
              throw new FS.ErrnoError(28)
            }
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && contents.buffer === buffer) {
              allocated = false;
              ptr = contents.byteOffset
            } else {
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length)
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length)
                }
              }
              allocated = true;
              ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48)
              }
              HEAP8.set(contents, ptr)
            }
            return {
              ptr: ptr,
              allocated: allocated
            }
          },
          msync: function(stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43)
            }
            if (mmapFlags & 2) {
              return 0
            }
            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
          }
        }
      };

      function asyncLoad(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
        readAsync(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep)
        }, function(event) {
          if (onerror) {
            onerror()
          } else {
            throw 'Loading data file "' + url + '" failed.'
          }
        });
        if (dep) addRunDependency(dep)
      }
      var FS = {
        root: null,
        mounts: [],
        devices: {},
        streams: [],
        nextInode: 1,
        nameTable: null,
        currentPath: "/",
        initialized: false,
        ignorePermissions: true,
        ErrnoError: null,
        genericErrors: {},
        filesystems: null,
        syncFSRequests: 0,
        lookupPath: (path, opts = {}) => {
          path = PATH_FS.resolve(FS.cwd(), path);
          if (!path) return {
            path: "",
            node: null
          };
          var defaults = {
            follow_mount: true,
            recurse_count: 0
          };
          for (var key in defaults) {
            if (opts[key] === undefined) {
              opts[key] = defaults[key]
            }
          }
          if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32)
          }
          var parts = PATH.normalizeArray(path.split("/").filter(p => !!p), false);
          var current = FS.root;
          var current_path = "/";
          for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
              break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
              if (!islast || islast && opts.follow_mount) {
                current = current.mounted.root
              }
            }
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                var lookup = FS.lookupPath(current_path, {
                  recurse_count: opts.recurse_count
                });
                current = lookup.node;
                if (count++ > 40) {
                  throw new FS.ErrnoError(32)
                }
              }
            }
          }
          return {
            path: current_path,
            node: current
          }
        },
        getPath: node => {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
          }
        },
        hashName: (parentid, name) => {
          var hash = 0;
          for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
          }
          return (parentid + hash >>> 0) % FS.nameTable.length
        },
        hashAddNode: node => {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node
        },
        hashRemoveNode: node => {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break
              }
              current = current.name_next
            }
          }
        },
        lookupNode: (parent, name) => {
          var errCode = FS.mayLookup(parent);
          if (errCode) {
            throw new FS.ErrnoError(errCode, parent)
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node
            }
          }
          return FS.lookup(parent, name)
        },
        createNode: (parent, name, mode, rdev) => {
          var node = new FS.FSNode(parent, name, mode, rdev);
          FS.hashAddNode(node);
          return node
        },
        destroyNode: node => {
          FS.hashRemoveNode(node)
        },
        isRoot: node => {
          return node === node.parent
        },
        isMountpoint: node => {
          return !!node.mounted
        },
        isFile: mode => {
          return (mode & 61440) === 32768
        },
        isDir: mode => {
          return (mode & 61440) === 16384
        },
        isLink: mode => {
          return (mode & 61440) === 40960
        },
        isChrdev: mode => {
          return (mode & 61440) === 8192
        },
        isBlkdev: mode => {
          return (mode & 61440) === 24576
        },
        isFIFO: mode => {
          return (mode & 61440) === 4096
        },
        isSocket: mode => {
          return (mode & 49152) === 49152
        },
        flagModes: {
          "r": 0,
          "r+": 2,
          "w": 577,
          "w+": 578,
          "a": 1089,
          "a+": 1090
        },
        modeStringToFlags: str => {
          var flags = FS.flagModes[str];
          if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str)
          }
          return flags
        },
        flagsToPermissionString: flag => {
          var perms = ["r", "w", "rw"][flag & 3];
          if (flag & 512) {
            perms += "w"
          }
          return perms
        },
        nodePermissions: (node, perms) => {
          if (FS.ignorePermissions) {
            return 0
          }
          if (perms.includes("r") && !(node.mode & 292)) {
            return 2
          } else if (perms.includes("w") && !(node.mode & 146)) {
            return 2
          } else if (perms.includes("x") && !(node.mode & 73)) {
            return 2
          }
          return 0
        },
        mayLookup: dir => {
          var errCode = FS.nodePermissions(dir, "x");
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0
        },
        mayCreate: (dir, name) => {
          try {
            var node = FS.lookupNode(dir, name);
            return 20
          } catch (e) {}
          return FS.nodePermissions(dir, "wx")
        },
        mayDelete: (dir, name, isdir) => {
          var node;
          try {
            node = FS.lookupNode(dir, name)
          } catch (e) {
            return e.errno
          }
          var errCode = FS.nodePermissions(dir, "wx");
          if (errCode) {
            return errCode
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 54
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 10
            }
          } else {
            if (FS.isDir(node.mode)) {
              return 31
            }
          }
          return 0
        },
        mayOpen: (node, flags) => {
          if (!node) {
            return 44
          }
          if (FS.isLink(node.mode)) {
            return 32
          } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
              return 31
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
        },
        MAX_OPEN_FDS: 4096,
        nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
          for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
              return fd
            }
          }
          throw new FS.ErrnoError(33)
        },
        getStream: fd => FS.streams[fd],
        createStream: (stream, fd_start, fd_end) => {
          if (!FS.FSStream) {
            FS.FSStream = function() {};
            FS.FSStream.prototype = {
              object: {
                get: function() {
                  return this.node
                },
                set: function(val) {
                  this.node = val
                }
              },
              isRead: {
                get: function() {
                  return (this.flags & 2097155) !== 1
                }
              },
              isWrite: {
                get: function() {
                  return (this.flags & 2097155) !== 0
                }
              },
              isAppend: {
                get: function() {
                  return this.flags & 1024
                }
              }
            }
          }
          stream = Object.assign(new FS.FSStream, stream);
          var fd = FS.nextfd(fd_start, fd_end);
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream
        },
        closeStream: fd => {
          FS.streams[fd] = null
        },
        chrdev_stream_ops: {
          open: stream => {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream)
            }
          },
          llseek: () => {
            throw new FS.ErrnoError(70)
          }
        },
        major: dev => dev >> 8,
        minor: dev => dev & 255,
        makedev: (ma, mi) => ma << 8 | mi,
        registerDevice: (dev, ops) => {
          FS.devices[dev] = {
            stream_ops: ops
          }
        },
        getDevice: dev => FS.devices[dev],
        getMounts: mount => {
          var mounts = [];
          var check = [mount];
          while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
          }
          return mounts
        },
        syncfs: (populate, callback) => {
          if (typeof populate === "function") {
            callback = populate;
            populate = false
          }
          FS.syncFSRequests++;
          if (FS.syncFSRequests > 1) {
            err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
          }
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;

          function doCallback(errCode) {
            FS.syncFSRequests--;
            return callback(errCode)
          }

          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode)
              }
              return
            }
            if (++completed >= mounts.length) {
              doCallback(null)
            }
          }
          mounts.forEach(mount => {
            if (!mount.type.syncfs) {
              return done(null)
            }
            mount.type.syncfs(mount, populate, done)
          })
        },
        mount: (type, opts, mountpoint) => {
          var root = mountpoint === "/";
          var pseudo = !mountpoint;
          var node;
          if (root && FS.root) {
            throw new FS.ErrnoError(10)
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
              follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10)
            }
            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54)
            }
          }
          var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
          };
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
          if (root) {
            FS.root = mountRoot
          } else if (node) {
            node.mounted = mount;
            if (node.mount) {
              node.mount.mounts.push(mount)
            }
          }
          return mountRoot
        },
        unmount: mountpoint => {
          var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
          });
          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28)
          }
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
          Object.keys(FS.nameTable).forEach(hash => {
            var current = FS.nameTable[hash];
            while (current) {
              var next = current.name_next;
              if (mounts.includes(current.mount)) {
                FS.destroyNode(current)
              }
              current = next
            }
          });
          node.mounted = null;
          var idx = node.mount.mounts.indexOf(mount);
          node.mount.mounts.splice(idx, 1)
        },
        lookup: (parent, name) => {
          return parent.node_ops.lookup(parent, name)
        },
        mknod: (path, mode, dev) => {
          var lookup = FS.lookupPath(path, {
            parent: true
          });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28)
          }
          var errCode = FS.mayCreate(parent, name);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63)
          }
          return parent.node_ops.mknod(parent, name, mode, dev)
        },
        create: (path, mode) => {
          mode = mode !== undefined ? mode : 438;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0)
        },
        mkdir: (path, mode) => {
          mode = mode !== undefined ? mode : 511;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0)
        },
        mkdirTree: (path, mode) => {
          var dirs = path.split("/");
          var d = "";
          for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
              FS.mkdir(d, mode)
            } catch (e) {
              if (e.errno != 20) throw e
            }
          }
        },
        mkdev: (path, mode, dev) => {
          if (typeof dev === "undefined") {
            dev = mode;
            mode = 438
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev)
        },
        symlink: (oldpath, newpath) => {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44)
          }
          var lookup = FS.lookupPath(newpath, {
            parent: true
          });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44)
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63)
          }
          return parent.node_ops.symlink(parent, newname, oldpath)
        },
        rename: (old_path, new_path) => {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          var lookup, old_dir, new_dir;
          lookup = FS.lookupPath(old_path, {
            parent: true
          });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, {
            parent: true
          });
          new_dir = lookup.node;
          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75)
          }
          var old_node = FS.lookupNode(old_dir, old_name);
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28)
          }
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55)
          }
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name)
          } catch (e) {}
          if (old_node === new_node) {
            return
          }
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10)
          }
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode)
            }
          }
          FS.hashRemoveNode(old_node);
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
          } catch (e) {
            throw e
          } finally {
            FS.hashAddNode(old_node)
          }
        },
        rmdir: path => {
          var lookup = FS.lookupPath(path, {
            parent: true
          });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node)
        },
        readdir: path => {
          var lookup = FS.lookupPath(path, {
            follow: true
          });
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54)
          }
          return node.node_ops.readdir(node)
        },
        unlink: path => {
          var lookup = FS.lookupPath(path, {
            parent: true
          });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44)
          }
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node)
        },
        readlink: path => {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(44)
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28)
          }
          return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
        },
        stat: (path, dontFollow) => {
          var lookup = FS.lookupPath(path, {
            follow: !dontFollow
          });
          var node = lookup.node;
          if (!node) {
            throw new FS.ErrnoError(44)
          }
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63)
          }
          return node.node_ops.getattr(node)
        },
        lstat: path => {
          return FS.stat(path, true)
        },
        chmod: (path, mode, dontFollow) => {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
              follow: !dontFollow
            });
            node = lookup.node
          } else {
            node = path
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
          }
          node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
          })
        },
        lchmod: (path, mode) => {
          FS.chmod(path, mode, true)
        },
        fchmod: (fd, mode) => {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8)
          }
          FS.chmod(stream.node, mode)
        },
        chown: (path, uid, gid, dontFollow) => {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
              follow: !dontFollow
            });
            node = lookup.node
          } else {
            node = path
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
          }
          node.node_ops.setattr(node, {
            timestamp: Date.now()
          })
        },
        lchown: (path, uid, gid) => {
          FS.chown(path, uid, gid, true)
        },
        fchown: (fd, uid, gid) => {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8)
          }
          FS.chown(stream.node, uid, gid)
        },
        truncate: (path, len) => {
          if (len < 0) {
            throw new FS.ErrnoError(28)
          }
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            node = lookup.node
          } else {
            node = path
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31)
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28)
          }
          var errCode = FS.nodePermissions(node, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
          })
        },
        ftruncate: (fd, len) => {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8)
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28)
          }
          FS.truncate(stream.node, len)
        },
        utime: (path, atime, mtime) => {
          var lookup = FS.lookupPath(path, {
            follow: true
          });
          var node = lookup.node;
          node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
          })
        },
        open: (path, flags, mode, fd_start, fd_end) => {
          if (path === "") {
            throw new FS.ErrnoError(44)
          }
          flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
          mode = typeof mode === "undefined" ? 438 : mode;
          if (flags & 64) {
            mode = mode & 4095 | 32768
          } else {
            mode = 0
          }
          var node;
          if (typeof path === "object") {
            node = path
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, {
                follow: !(flags & 131072)
              });
              node = lookup.node
            } catch (e) {}
          }
          var created = false;
          if (flags & 64) {
            if (node) {
              if (flags & 128) {
                throw new FS.ErrnoError(20)
              }
            } else {
              node = FS.mknod(path, mode, 0);
              created = true
            }
          }
          if (!node) {
            throw new FS.ErrnoError(44)
          }
          if (FS.isChrdev(node.mode)) {
            flags &= ~512
          }
          if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54)
          }
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
              throw new FS.ErrnoError(errCode)
            }
          }
          if (flags & 512) {
            FS.truncate(node, 0)
          }
          flags &= ~(128 | 512 | 131072);
          var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
          }, fd_start, fd_end);
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
          }
          if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1
            }
          }
          return stream
        },
        close: stream => {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if (stream.getdents) stream.getdents = null;
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream)
            }
          } catch (e) {
            throw e
          } finally {
            FS.closeStream(stream.fd)
          }
          stream.fd = null
        },
        isClosed: stream => {
          return stream.fd === null
        },
        llseek: (stream, offset, whence) => {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70)
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28)
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position
        },
        read: (stream, buffer, offset, length, position) => {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8)
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28)
          }
          var seeking = typeof position !== "undefined";
          if (!seeking) {
            position = stream.position
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead
        },
        write: (stream, buffer, offset, length, position, canOwn) => {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28)
          }
          if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
          }
          var seeking = typeof position !== "undefined";
          if (!seeking) {
            position = stream.position
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          return bytesWritten
        },
        allocate: (stream, offset, length) => {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
          }
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28)
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43)
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138)
          }
          stream.stream_ops.allocate(stream, offset, length)
        },
        mmap: (stream, address, length, position, prot, flags) => {
          if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2)
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2)
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43)
          }
          return stream.stream_ops.mmap(stream, address, length, position, prot, flags)
        },
        msync: (stream, buffer, offset, length, mmapFlags) => {
          if (!stream || !stream.stream_ops.msync) {
            return 0
          }
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
        },
        munmap: stream => 0,
        ioctl: (stream, cmd, arg) => {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59)
          }
          return stream.stream_ops.ioctl(stream, cmd, arg)
        },
        readFile: (path, opts = {}) => {
          opts.flags = opts.flags || 0;
          opts.encoding = opts.encoding || "binary";
          if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
          }
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
          } else if (opts.encoding === "binary") {
            ret = buf
          }
          FS.close(stream);
          return ret
        },
        writeFile: (path, data, opts = {}) => {
          opts.flags = opts.flags || 577;
          var stream = FS.open(path, opts.flags, opts.mode);
          if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
          } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
          } else {
            throw new Error("Unsupported data type")
          }
          FS.close(stream)
        },
        cwd: () => FS.currentPath,
        chdir: path => {
          var lookup = FS.lookupPath(path, {
            follow: true
          });
          if (lookup.node === null) {
            throw new FS.ErrnoError(44)
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54)
          }
          var errCode = FS.nodePermissions(lookup.node, "x");
          if (errCode) {
            throw new FS.ErrnoError(errCode)
          }
          FS.currentPath = lookup.path
        },
        createDefaultDirectories: () => {
          FS.mkdir("/tmp");
          FS.mkdir("/home");
          FS.mkdir("/home/web_user")
        },
        createDefaultDevices: () => {
          FS.mkdir("/dev");
          FS.registerDevice(FS.makedev(1, 3), {
            read: () => 0,
            write: (stream, buffer, offset, length, pos) => length
          });
          FS.mkdev("/dev/null", FS.makedev(1, 3));
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev("/dev/tty", FS.makedev(5, 0));
          FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var random_device = getRandomDevice();
          FS.createDevice("/dev", "random", random_device);
          FS.createDevice("/dev", "urandom", random_device);
          FS.mkdir("/dev/shm");
          FS.mkdir("/dev/shm/tmp")
        },
        createSpecialDirectories: () => {
          FS.mkdir("/proc");
          var proc_self = FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd");
          FS.mount({
            mount: () => {
              var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
              node.node_ops = {
                lookup: (parent, name) => {
                  var fd = +name;
                  var stream = FS.getStream(fd);
                  if (!stream) throw new FS.ErrnoError(8);
                  var ret = {
                    parent: null,
                    mount: {
                      mountpoint: "fake"
                    },
                    node_ops: {
                      readlink: () => stream.path
                    }
                  };
                  ret.parent = ret;
                  return ret
                }
              };
              return node
            }
          }, {}, "/proc/self/fd")
        },
        createStandardStreams: () => {
          if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
          } else {
            FS.symlink("/dev/tty", "/dev/stdin")
          }
          if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
          } else {
            FS.symlink("/dev/tty", "/dev/stdout")
          }
          if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
          } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
          }
          var stdin = FS.open("/dev/stdin", 0);
          var stdout = FS.open("/dev/stdout", 1);
          var stderr = FS.open("/dev/stderr", 1)
        },
        ensureErrnoError: () => {
          if (FS.ErrnoError) return;
          FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function(errno) {
              this.errno = errno
            };
            this.setErrno(errno);
            this.message = "FS error"
          };
          FS.ErrnoError.prototype = new Error;
          FS.ErrnoError.prototype.constructor = FS.ErrnoError;
          [44].forEach(code => {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
          })
        },
        staticInit: () => {
          FS.ensureErrnoError();
          FS.nameTable = new Array(4096);
          FS.mount(MEMFS, {}, "/");
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
          FS.filesystems = {
            "MEMFS": MEMFS
          }
        },
        init: (input, output, error) => {
          FS.init.initialized = true;
          FS.ensureErrnoError();
          Module["stdin"] = input || Module["stdin"];
          Module["stdout"] = output || Module["stdout"];
          Module["stderr"] = error || Module["stderr"];
          FS.createStandardStreams()
        },
        quit: () => {
          FS.init.initialized = false;
          ___stdio_exit();
          for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
              continue
            }
            FS.close(stream)
          }
        },
        getMode: (canRead, canWrite) => {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode
        },
        findObject: (path, dontResolveLastLink) => {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (ret.exists) {
            return ret.object
          } else {
            return null
          }
        },
        analyzePath: (path, dontResolveLastLink) => {
          try {
            var lookup = FS.lookupPath(path, {
              follow: !dontResolveLastLink
            });
            path = lookup.path
          } catch (e) {}
          var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
          };
          try {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
              follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
          } catch (e) {
            ret.error = e.errno
          }
          return ret
        },
        createPath: (parent, path, canRead, canWrite) => {
          parent = typeof parent === "string" ? parent : FS.getPath(parent);
          var parts = path.split("/").reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current)
            } catch (e) {}
            parent = current
          }
          return current
        },
        createFile: (parent, name, properties, canRead, canWrite) => {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.create(path, mode)
        },
        createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
          var path = name;
          if (parent) {
            parent = typeof parent === "string" ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent
          }
          var mode = FS.getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data === "string") {
              var arr = new Array(data.length);
              for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
              data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
          }
          return node
        },
        createDevice: (parent, name, input, output) => {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(!!input, !!output);
          if (!FS.createDevice.major) FS.createDevice.major = 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          FS.registerDevice(dev, {
            open: stream => {
              stream.seekable = false
            },
            close: stream => {
              if (output && output.buffer && output.buffer.length) {
                output(10)
              }
            },
            read: (stream, buffer, offset, length, pos) => {
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = input()
                } catch (e) {
                  throw new FS.ErrnoError(29)
                }
                if (result === undefined && bytesRead === 0) {
                  throw new FS.ErrnoError(6)
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now()
              }
              return bytesRead
            },
            write: (stream, buffer, offset, length, pos) => {
              for (var i = 0; i < length; i++) {
                try {
                  output(buffer[offset + i])
                } catch (e) {
                  throw new FS.ErrnoError(29)
                }
              }
              if (length) {
                stream.node.timestamp = Date.now()
              }
              return i
            }
          });
          return FS.mkdev(path, mode, dev)
        },
        forceLoadFile: obj => {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
          } else if (read_) {
            try {
              obj.contents = intArrayFromString(read_(obj.url), true);
              obj.usedBytes = obj.contents.length
            } catch (e) {
              throw new FS.ErrnoError(29)
            }
          } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
          }
        },
        createLazyFile: (parent, name, url, canRead, canWrite) => {
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
              return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
          };
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
          };
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (from, to) => {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
              var xhr = new XMLHttpRequest;
              xhr.open("GET", url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
              xhr.responseType = "arraybuffer";
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined")
              }
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || [])
              } else {
                return intArrayFromString(xhr.responseText || "", true)
              }
            };
            var lazyArray = this;
            lazyArray.setDataGetter(chunkNum => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1;
              end = Math.min(end, datalength - 1);
              if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end)
              }
              if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
              return lazyArray.chunks[chunkNum]
            });
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1;
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
          };
          if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
              length: {
                get: function() {
                  if (!this.lengthKnown) {
                    this.cacheLength()
                  }
                  return this._length
                }
              },
              chunkSize: {
                get: function() {
                  if (!this.lengthKnown) {
                    this.cacheLength()
                  }
                  return this._chunkSize
                }
              }
            });
            var properties = {
              isDevice: false,
              contents: lazyArray
            }
          } else {
            var properties = {
              isDevice: false,
              url: url
            }
          }
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          if (properties.contents) {
            node.contents = properties.contents
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
          }
          Object.defineProperties(node, {
            usedBytes: {
              get: function() {
                return this.contents.length
              }
            }
          });
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach(key => {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
              FS.forceLoadFile(node);
              return fn.apply(null, arguments)
            }
          });
          stream_ops.read = ((stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i]
              }
            } else {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents.get(position + i)
              }
            }
            return size
          });
          node.stream_ops = stream_ops;
          return node
        },
        createPreloadedFile: (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency("cp " + fullname);

          function processData(byteArray) {
            function finish(byteArray) {
              if (preFinish) preFinish();
              if (!dontCreateFile) {
                FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
              }
              if (onload) onload();
              removeRunDependency(dep)
            }
            if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
                if (onerror) onerror();
                removeRunDependency(dep)
              })) {
              return
            }
            finish(byteArray)
          }
          addRunDependency(dep);
          if (typeof url == "string") {
            asyncLoad(url, byteArray => processData(byteArray), onerror)
          } else {
            processData(url)
          }
        },
        indexedDB: () => {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        },
        DB_NAME: () => {
          return "EM_FS_" + window.location.pathname
        },
        DB_VERSION: 20,
        DB_STORE_NAME: "FILE_DATA",
        saveFilesToDB: (paths, onload, onerror) => {
          onload = onload || (() => {});
          onerror = onerror || (() => {});
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
          } catch (e) {
            return onerror(e)
          }
          openRequest.onupgradeneeded = (() => {
            out("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
          });
          openRequest.onsuccess = (() => {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
              fail = 0,
              total = paths.length;

            function finish() {
              if (fail == 0) onload();
              else onerror()
            }
            paths.forEach(path => {
              var putRequest = files.put(FS.analyzePath(path).object.contents, path);
              putRequest.onsuccess = (() => {
                ok++;
                if (ok + fail == total) finish()
              });
              putRequest.onerror = (() => {
                fail++;
                if (ok + fail == total) finish()
              })
            });
            transaction.onerror = onerror
          });
          openRequest.onerror = onerror
        },
        loadFilesFromDB: (paths, onload, onerror) => {
          onload = onload || (() => {});
          onerror = onerror || (() => {});
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
          } catch (e) {
            return onerror(e)
          }
          openRequest.onupgradeneeded = onerror;
          openRequest.onsuccess = (() => {
            var db = openRequest.result;
            try {
              var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
              onerror(e);
              return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
              fail = 0,
              total = paths.length;

            function finish() {
              if (fail == 0) onload();
              else onerror()
            }
            paths.forEach(path => {
              var getRequest = files.get(path);
              getRequest.onsuccess = (() => {
                if (FS.analyzePath(path).exists) {
                  FS.unlink(path)
                }
                FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                ok++;
                if (ok + fail == total) finish()
              });
              getRequest.onerror = (() => {
                fail++;
                if (ok + fail == total) finish()
              })
            });
            transaction.onerror = onerror
          });
          openRequest.onerror = onerror
        }
      };
      var SYSCALLS = {
        mappings: {},
        DEFAULT_POLLMASK: 5,
        calculateAt: function(dirfd, path, allowEmpty) {
          if (path[0] === "/") {
            return path
          }
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd()
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(8);
            dir = dirstream.path
          }
          if (path.length == 0) {
            if (!allowEmpty) {
              throw new FS.ErrnoError(44)
            }
            return dir
          }
          return PATH.join2(dir, path)
        },
        doStat: function(func, path, buf) {
          try {
            var stat = func(path)
          } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
              return -54
            }
            throw e
          }
          HEAP32[buf >> 2] = stat.dev;
          HEAP32[buf + 4 >> 2] = 0;
          HEAP32[buf + 8 >> 2] = stat.ino;
          HEAP32[buf + 12 >> 2] = stat.mode;
          HEAP32[buf + 16 >> 2] = stat.nlink;
          HEAP32[buf + 20 >> 2] = stat.uid;
          HEAP32[buf + 24 >> 2] = stat.gid;
          HEAP32[buf + 28 >> 2] = stat.rdev;
          HEAP32[buf + 32 >> 2] = 0;
          tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
          HEAP32[buf + 48 >> 2] = 4096;
          HEAP32[buf + 52 >> 2] = stat.blocks;
          HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
          HEAP32[buf + 60 >> 2] = 0;
          HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
          HEAP32[buf + 68 >> 2] = 0;
          HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
          HEAP32[buf + 76 >> 2] = 0;
          tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
          return 0
        },
        doMsync: function(addr, stream, len, flags, offset) {
          var buffer = HEAPU8.slice(addr, addr + len);
          FS.msync(stream, buffer, offset, len, flags)
        },
        doMkdir: function(path, mode) {
          path = PATH.normalize(path);
          if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
          FS.mkdir(path, mode, 0);
          return 0
        },
        doMknod: function(path, mode, dev) {
          switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
              break;
            default:
              return -28
          }
          FS.mknod(path, mode, dev);
          return 0
        },
        doReadlink: function(path, buf, bufsize) {
          if (bufsize <= 0) return -28;
          var ret = FS.readlink(path);
          var len = Math.min(bufsize, lengthBytesUTF8(ret));
          var endChar = HEAP8[buf + len];
          stringToUTF8(ret, buf, bufsize + 1);
          HEAP8[buf + len] = endChar;
          return len
        },
        doAccess: function(path, amode) {
          if (amode & ~7) {
            return -28
          }
          var lookup = FS.lookupPath(path, {
            follow: true
          });
          var node = lookup.node;
          if (!node) {
            return -44
          }
          var perms = "";
          if (amode & 4) perms += "r";
          if (amode & 2) perms += "w";
          if (amode & 1) perms += "x";
          if (perms && FS.nodePermissions(node, perms)) {
            return -2
          }
          return 0
        },
        doDup: function(path, flags, suggestFD) {
          var suggest = FS.getStream(suggestFD);
          if (suggest) FS.close(suggest);
          return FS.open(path, flags, 0, suggestFD, suggestFD).fd
        },
        doReadv: function(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break
          }
          return ret
        },
        doWritev: function(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr
          }
          return ret
        },
        varargs: undefined,
        get: function() {
          SYSCALLS.varargs += 4;
          var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
          return ret
        },
        getStr: function(ptr) {
          var ret = UTF8ToString(ptr);
          return ret
        },
        getStreamFromFD: function(fd) {
          var stream = FS.getStream(fd);
          if (!stream) throw new FS.ErrnoError(8);
          return stream
        },
        get64: function(low, high) {
          return low
        }
      };

      function ___syscall_access(path, amode) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doAccess(path, amode)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_chdir(path) {
        try {
          path = SYSCALLS.getStr(path);
          FS.chdir(path);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_chmod(path, mode) {
        try {
          path = SYSCALLS.getStr(path);
          FS.chmod(path, mode);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_dup3(fd, suggestFD, flags) {
        try {
          var old = SYSCALLS.getStreamFromFD(fd);
          if (old.fd === suggestFD) return -28;
          return SYSCALLS.doDup(old.path, old.flags, suggestFD)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function setErrNo(value) {
        HEAP32[___errno_location() >> 2] = value;
        return value
      }

      function ___syscall_fcntl64(fd, cmd, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (cmd) {
            case 0: {
              var arg = SYSCALLS.get();
              if (arg < 0) {
                return -28
              }
              var newStream;
              newStream = FS.open(stream.path, stream.flags, 0, arg);
              return newStream.fd
            }
            case 1:
            case 2:
              return 0;
            case 3:
              return stream.flags;
            case 4: {
              var arg = SYSCALLS.get();
              stream.flags |= arg;
              return 0
            }
            case 5: {
              var arg = SYSCALLS.get();
              var offset = 0;
              HEAP16[arg + offset >> 1] = 2;
              return 0
            }
            case 6:
            case 7:
              return 0;
            case 16:
            case 8:
              return -28;
            case 9:
              setErrNo(28);
              return -1;
            default: {
              return -28
            }
          }
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_fstat64(fd, buf) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          return SYSCALLS.doStat(FS.stat, stream.path, buf)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_fstatat64(dirfd, path, buf, flags) {
        try {
          path = SYSCALLS.getStr(path);
          var nofollow = flags & 256;
          var allowEmpty = flags & 4096;
          flags = flags & ~4352;
          path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
          return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_ftruncate64(fd, low, high) {
        try {
          var length = SYSCALLS.get64(low, high);
          FS.ftruncate(fd, length);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_getcwd(buf, size) {
        try {
          if (size === 0) return -28;
          var cwd = FS.cwd();
          var cwdLengthInBytes = lengthBytesUTF8(cwd);
          if (size < cwdLengthInBytes + 1) return -68;
          stringToUTF8(cwd, buf, size);
          return buf
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_getdents64(fd, dirp, count) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          if (!stream.getdents) {
            stream.getdents = FS.readdir(stream.path)
          }
          var struct_size = 280;
          var pos = 0;
          var off = FS.llseek(stream, 0, 1);
          var idx = Math.floor(off / struct_size);
          while (idx < stream.getdents.length && pos + struct_size <= count) {
            var id;
            var type;
            var name = stream.getdents[idx];
            if (name === ".") {
              id = stream.node.id;
              type = 4
            } else if (name === "..") {
              var lookup = FS.lookupPath(stream.path, {
                parent: true
              });
              id = lookup.node.id;
              type = 4
            } else {
              var child = FS.lookupNode(stream.node, name);
              id = child.id;
              type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8
            }
            tempI64 = [id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos >> 2] = tempI64[0], HEAP32[dirp + pos + 4 >> 2] = tempI64[1];
            tempI64 = [(idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos + 8 >> 2] = tempI64[0], HEAP32[dirp + pos + 12 >> 2] = tempI64[1];
            HEAP16[dirp + pos + 16 >> 1] = 280;
            HEAP8[dirp + pos + 18 >> 0] = type;
            stringToUTF8(name, dirp + pos + 19, 256);
            pos += struct_size;
            idx += 1
          }
          FS.llseek(stream, idx * struct_size, 0);
          return pos
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_getegid32() {
        return 0
      }

      function ___syscall_getuid32() {
        return ___syscall_getegid32()
      }

      function ___syscall_ioctl(fd, op, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (op) {
            case 21509:
            case 21505: {
              if (!stream.tty) return -59;
              return 0
            }
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508: {
              if (!stream.tty) return -59;
              return 0
            }
            case 21519: {
              if (!stream.tty) return -59;
              var argp = SYSCALLS.get();
              HEAP32[argp >> 2] = 0;
              return 0
            }
            case 21520: {
              if (!stream.tty) return -59;
              return -28
            }
            case 21531: {
              var argp = SYSCALLS.get();
              return FS.ioctl(stream, op, argp)
            }
            case 21523: {
              if (!stream.tty) return -59;
              return 0
            }
            case 21524: {
              if (!stream.tty) return -59;
              return 0
            }
            default:
              abort("bad ioctl syscall " + op)
          }
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_lstat64(path, buf) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doStat(FS.lstat, path, buf)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_mkdir(path, mode) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doMkdir(path, mode)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function syscallMmap2(addr, len, prot, flags, fd, off) {
        off <<= 12;
        var ptr;
        var allocated = false;
        if ((flags & 16) !== 0 && addr % 65536 !== 0) {
          return -28
        }
        if ((flags & 32) !== 0) {
          ptr = mmapAlloc(len);
          if (!ptr) return -48;
          allocated = true
        } else {
          var info = FS.getStream(fd);
          if (!info) return -8;
          var res = FS.mmap(info, addr, len, off, prot, flags);
          ptr = res.ptr;
          allocated = res.allocated
        }
        SYSCALLS.mappings[ptr] = {
          malloc: ptr,
          len: len,
          allocated: allocated,
          fd: fd,
          prot: prot,
          flags: flags,
          offset: off
        };
        return ptr
      }

      function ___syscall_mmap2(addr, len, prot, flags, fd, off) {
        try {
          return syscallMmap2(addr, len, prot, flags, fd, off)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function syscallMunmap(addr, len) {
        var info = SYSCALLS.mappings[addr];
        if (len === 0 || !info) {
          return -28
        }
        if (len === info.len) {
          var stream = FS.getStream(info.fd);
          if (stream) {
            if (info.prot & 2) {
              SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset)
            }
            FS.munmap(stream)
          }
          SYSCALLS.mappings[addr] = null;
          if (info.allocated) {
            _free(info.malloc)
          }
        }
        return 0
      }

      function ___syscall_munmap(addr, len) {
        try {
          return syscallMunmap(addr, len)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_open(path, flags, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var pathname = SYSCALLS.getStr(path);
          var mode = varargs ? SYSCALLS.get() : 0;
          var stream = FS.open(pathname, flags, mode);
          return stream.fd
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_poll(fds, nfds, timeout) {
        try {
          var nonzero = 0;
          for (var i = 0; i < nfds; i++) {
            var pollfd = fds + 8 * i;
            var fd = HEAP32[pollfd >> 2];
            var events = HEAP16[pollfd + 4 >> 1];
            var mask = 32;
            var stream = FS.getStream(fd);
            if (stream) {
              mask = SYSCALLS.DEFAULT_POLLMASK;
              if (stream.stream_ops.poll) {
                mask = stream.stream_ops.poll(stream)
              }
            }
            mask &= events | 8 | 16;
            if (mask) nonzero++;
            HEAP16[pollfd + 6 >> 1] = mask
          }
          return nonzero
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_readlink(path, buf, bufsize) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doReadlink(path, buf, bufsize)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_rename(old_path, new_path) {
        try {
          old_path = SYSCALLS.getStr(old_path);
          new_path = SYSCALLS.getStr(new_path);
          FS.rename(old_path, new_path);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_rmdir(path) {
        try {
          path = SYSCALLS.getStr(path);
          FS.rmdir(path);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_stat64(path, buf) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doStat(FS.stat, path, buf)
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function ___syscall_unlink(path) {
        try {
          path = SYSCALLS.getStr(path);
          FS.unlink(path);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return -e.errno
        }
      }

      function __dlopen_js(filename, flag) {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking")
      }

      function __dlsym_js(handle, symbol) {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking")
      }

      function __emscripten_throw_longjmp() {
        throw "longjmp"
      }

      function __localtime_js(time, tmPtr) {
        var date = new Date(HEAP32[time >> 2] * 1e3);
        HEAP32[tmPtr >> 2] = date.getSeconds();
        HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
        HEAP32[tmPtr + 8 >> 2] = date.getHours();
        HEAP32[tmPtr + 12 >> 2] = date.getDate();
        HEAP32[tmPtr + 16 >> 2] = date.getMonth();
        HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
        HEAP32[tmPtr + 24 >> 2] = date.getDay();
        var start = new Date(date.getFullYear(), 0, 1);
        var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
        HEAP32[tmPtr + 28 >> 2] = yday;
        HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
        HEAP32[tmPtr + 32 >> 2] = dst
      }

      function __mktime_js(tmPtr) {
        var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
        var dst = HEAP32[tmPtr + 32 >> 2];
        var guessedOffset = date.getTimezoneOffset();
        var start = new Date(date.getFullYear(), 0, 1);
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dstOffset = Math.min(winterOffset, summerOffset);
        if (dst < 0) {
          HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset)
        } else if (dst > 0 != (dstOffset == guessedOffset)) {
          var nonDstOffset = Math.max(winterOffset, summerOffset);
          var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
          date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4)
        }
        HEAP32[tmPtr + 24 >> 2] = date.getDay();
        var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
        HEAP32[tmPtr + 28 >> 2] = yday;
        HEAP32[tmPtr >> 2] = date.getSeconds();
        HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
        HEAP32[tmPtr + 8 >> 2] = date.getHours();
        HEAP32[tmPtr + 12 >> 2] = date.getDate();
        HEAP32[tmPtr + 16 >> 2] = date.getMonth();
        return date.getTime() / 1e3 | 0
      }

      function _tzset_impl(timezone, daylight, tzname) {
        var currentYear = (new Date).getFullYear();
        var winter = new Date(currentYear, 0, 1);
        var summer = new Date(currentYear, 6, 1);
        var winterOffset = winter.getTimezoneOffset();
        var summerOffset = summer.getTimezoneOffset();
        var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
        HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
        HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);

        function extractZone(date) {
          var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
          return match ? match[1] : "GMT"
        }
        var winterName = extractZone(winter);
        var summerName = extractZone(summer);
        var winterNamePtr = allocateUTF8(winterName);
        var summerNamePtr = allocateUTF8(summerName);
        if (summerOffset < winterOffset) {
          HEAP32[tzname >> 2] = winterNamePtr;
          HEAP32[tzname + 4 >> 2] = summerNamePtr
        } else {
          HEAP32[tzname >> 2] = summerNamePtr;
          HEAP32[tzname + 4 >> 2] = winterNamePtr
        }
      }

      function __tzset_js(timezone, daylight, tzname) {
        if (__tzset_js.called) return;
        __tzset_js.called = true;
        _tzset_impl(timezone, daylight, tzname)
      }

      function _abort() {
        abort("")
      }
      var _emscripten_get_now;
      if (ENVIRONMENT_IS_NODE) {
        _emscripten_get_now = (() => {
          var t = process["hrtime"]();
          return t[0] * 1e3 + t[1] / 1e6
        })
      } else _emscripten_get_now = (() => performance.now());
      var _emscripten_get_now_is_monotonic = true;

      function _clock_gettime(clk_id, tp) {
        var now;
        if (clk_id === 0) {
          now = Date.now()
        } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
          now = _emscripten_get_now()
        } else {
          setErrNo(28);
          return -1
        }
        HEAP32[tp >> 2] = now / 1e3 | 0;
        HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
        return 0
      }

      function _emscripten_get_heap_max() {
        return HEAPU8.length
      }

      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num)
      }

      function abortOnCannotGrowMemory(requestedSize) {
        abort("OOM")
      }

      function _emscripten_resize_heap(requestedSize) {
        var oldSize = HEAPU8.length;
        requestedSize = requestedSize >>> 0;
        abortOnCannotGrowMemory(requestedSize)
      }
      var ENV = {};

      function getExecutableName() {
        return thisProgram || "./this.program"
      }

      function getEnvStrings() {
        if (!getEnvStrings.strings) {
          var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
          var env = {
            "USER": "web_user",
            "LOGNAME": "web_user",
            "PATH": "/",
            "PWD": "/",
            "HOME": "/home/web_user",
            "LANG": lang,
            "_": getExecutableName()
          };
          for (var x in ENV) {
            if (ENV[x] === undefined) delete env[x];
            else env[x] = ENV[x]
          }
          var strings = [];
          for (var x in env) {
            strings.push(x + "=" + env[x])
          }
          getEnvStrings.strings = strings
        }
        return getEnvStrings.strings
      }

      function _environ_get(__environ, environ_buf) {
        var bufSize = 0;
        getEnvStrings().forEach(function(string, i) {
          var ptr = environ_buf + bufSize;
          HEAP32[__environ + i * 4 >> 2] = ptr;
          writeAsciiToMemory(string, ptr);
          bufSize += string.length + 1
        });
        return 0
      }

      function _environ_sizes_get(penviron_count, penviron_buf_size) {
        var strings = getEnvStrings();
        HEAP32[penviron_count >> 2] = strings.length;
        var bufSize = 0;
        strings.forEach(function(string) {
          bufSize += string.length + 1
        });
        HEAP32[penviron_buf_size >> 2] = bufSize;
        return 0
      }

      function _exit(status) {
        exit(status)
      }

      function _fd_close(fd) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          FS.close(stream);
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno
        }
      }

      function _fd_fdstat_get(fd, pbuf) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
          HEAP8[pbuf >> 0] = type;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno
        }
      }

      function _fd_read(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doReadv(stream, iov, iovcnt);
          HEAP32[pnum >> 2] = num;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno
        }
      }

      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var HIGH_OFFSET = 4294967296;
          var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
          var DOUBLE_LIMIT = 9007199254740992;
          if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
            return -61
          }
          FS.llseek(stream, offset, whence);
          tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
          if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno
        }
      }

      function _fd_write(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doWritev(stream, iov, iovcnt);
          HEAP32[pnum >> 2] = num;
          return 0
        } catch (e) {
          if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) throw e;
          return e.errno
        }
      }

      function _getTempRet0() {
        return getTempRet0()
      }

      function _gettimeofday(ptr) {
        var now = Date.now();
        HEAP32[ptr >> 2] = now / 1e3 | 0;
        HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
        return 0
      }

      function _setTempRet0(val) {
        setTempRet0(val)
      }

      function __isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
      }

      function __arraySum(array, index) {
        var sum = 0;
        for (var i = 0; i <= index; sum += array[i++]) {}
        return sum
      }
      var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      function __addDays(date, days) {
        var newDate = new Date(date.getTime());
        while (days > 0) {
          var leap = __isLeapYear(newDate.getFullYear());
          var currentMonth = newDate.getMonth();
          var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
          if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
              newDate.setMonth(currentMonth + 1)
            } else {
              newDate.setMonth(0);
              newDate.setFullYear(newDate.getFullYear() + 1)
            }
          } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
          }
        }
        return newDate
      }

      function _strftime(s, maxsize, format, tm) {
        var tm_zone = HEAP32[tm + 40 >> 2];
        var date = {
          tm_sec: HEAP32[tm >> 2],
          tm_min: HEAP32[tm + 4 >> 2],
          tm_hour: HEAP32[tm + 8 >> 2],
          tm_mday: HEAP32[tm + 12 >> 2],
          tm_mon: HEAP32[tm + 16 >> 2],
          tm_year: HEAP32[tm + 20 >> 2],
          tm_wday: HEAP32[tm + 24 >> 2],
          tm_yday: HEAP32[tm + 28 >> 2],
          tm_isdst: HEAP32[tm + 32 >> 2],
          tm_gmtoff: HEAP32[tm + 36 >> 2],
          tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
        };
        var pattern = UTF8ToString(format);
        var EXPANSION_RULES_1 = {
          "%c": "%a %b %d %H:%M:%S %Y",
          "%D": "%m/%d/%y",
          "%F": "%Y-%m-%d",
          "%h": "%b",
          "%r": "%I:%M:%S %p",
          "%R": "%H:%M",
          "%T": "%H:%M:%S",
          "%x": "%m/%d/%y",
          "%X": "%H:%M:%S",
          "%Ec": "%c",
          "%EC": "%C",
          "%Ex": "%m/%d/%y",
          "%EX": "%H:%M:%S",
          "%Ey": "%y",
          "%EY": "%Y",
          "%Od": "%d",
          "%Oe": "%e",
          "%OH": "%H",
          "%OI": "%I",
          "%Om": "%m",
          "%OM": "%M",
          "%OS": "%S",
          "%Ou": "%u",
          "%OU": "%U",
          "%OV": "%V",
          "%Ow": "%w",
          "%OW": "%W",
          "%Oy": "%y"
        };
        for (var rule in EXPANSION_RULES_1) {
          pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule])
        }
        var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        function leadingSomething(value, digits, character) {
          var str = typeof value === "number" ? value.toString() : value || "";
          while (str.length < digits) {
            str = character[0] + str
          }
          return str
        }

        function leadingNulls(value, digits) {
          return leadingSomething(value, digits, "0")
        }

        function compareByDay(date1, date2) {
          function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
          }
          var compare;
          if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
              compare = sgn(date1.getDate() - date2.getDate())
            }
          }
          return compare
        }

        function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0:
              return new Date(janFourth.getFullYear() - 1, 11, 29);
            case 1:
              return janFourth;
            case 2:
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
              return new Date(janFourth.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(janFourth.getFullYear() - 1, 11, 30)
          }
        }

        function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear() + 1
            } else {
              return thisDate.getFullYear()
            }
          } else {
            return thisDate.getFullYear() - 1
          }
        }
        var EXPANSION_RULES_2 = {
          "%a": function(date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
          },
          "%A": function(date) {
            return WEEKDAYS[date.tm_wday]
          },
          "%b": function(date) {
            return MONTHS[date.tm_mon].substring(0, 3)
          },
          "%B": function(date) {
            return MONTHS[date.tm_mon]
          },
          "%C": function(date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
          },
          "%d": function(date) {
            return leadingNulls(date.tm_mday, 2)
          },
          "%e": function(date) {
            return leadingSomething(date.tm_mday, 2, " ")
          },
          "%g": function(date) {
            return getWeekBasedYear(date).toString().substring(2)
          },
          "%G": function(date) {
            return getWeekBasedYear(date)
          },
          "%H": function(date) {
            return leadingNulls(date.tm_hour, 2)
          },
          "%I": function(date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
          },
          "%j": function(date) {
            return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
          },
          "%m": function(date) {
            return leadingNulls(date.tm_mon + 1, 2)
          },
          "%M": function(date) {
            return leadingNulls(date.tm_min, 2)
          },
          "%n": function() {
            return "\n"
          },
          "%p": function(date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
              return "AM"
            } else {
              return "PM"
            }
          },
          "%S": function(date) {
            return leadingNulls(date.tm_sec, 2)
          },
          "%t": function() {
            return "\t"
          },
          "%u": function(date) {
            return date.tm_wday || 7
          },
          "%U": function(date) {
            var janFirst = new Date(date.tm_year + 1900, 0, 1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
            if (compareByDay(firstSunday, endDate) < 0) {
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
              var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
              var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
              return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
          },
          "%V": function(date) {
            var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
            var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
              return "53"
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
              return "01"
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
              daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
            } else {
              daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2)
          },
          "%w": function(date) {
            return date.tm_wday
          },
          "%W": function(date) {
            var janFirst = new Date(date.tm_year, 0, 1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
            var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
            if (compareByDay(firstMonday, endDate) < 0) {
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
              var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
              var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
              return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
          },
          "%y": function(date) {
            return (date.tm_year + 1900).toString().substring(2)
          },
          "%Y": function(date) {
            return date.tm_year + 1900
          },
          "%z": function(date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
          },
          "%Z": function(date) {
            return date.tm_zone
          },
          "%%": function() {
            return "%"
          }
        };
        pattern = pattern.replace(/%%/g, "\0\0");
        for (var rule in EXPANSION_RULES_2) {
          if (pattern.includes(rule)) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date))
          }
        }
        pattern = pattern.replace(/\0\0/g, "%");
        var bytes = intArrayFromString(pattern, false);
        if (bytes.length > maxsize) {
          return 0
        }
        writeArrayToMemory(bytes, s);
        return bytes.length - 1
      }

      function _time(ptr) {
        var ret = Date.now() / 1e3 | 0;
        if (ptr) {
          HEAP32[ptr >> 2] = ret
        }
        return ret
      }
      var FSNode = function(parent, name, mode, rdev) {
        if (!parent) {
          parent = this
        }
        this.parent = parent;
        this.mount = parent.mount;
        this.mounted = null;
        this.id = FS.nextInode++;
        this.name = name;
        this.mode = mode;
        this.node_ops = {};
        this.stream_ops = {};
        this.rdev = rdev
      };
      var readMode = 292 | 73;
      var writeMode = 146;
      Object.defineProperties(FSNode.prototype, {
        read: {
          get: function() {
            return (this.mode & readMode) === readMode
          },
          set: function(val) {
            val ? this.mode |= readMode : this.mode &= ~readMode
          }
        },
        write: {
          get: function() {
            return (this.mode & writeMode) === writeMode
          },
          set: function(val) {
            val ? this.mode |= writeMode : this.mode &= ~writeMode
          }
        },
        isFolder: {
          get: function() {
            return FS.isDir(this.mode)
          }
        },
        isDevice: {
          get: function() {
            return FS.isChrdev(this.mode)
          }
        }
      });
      FS.FSNode = FSNode;
      FS.staticInit();
      Module["FS_createPath"] = FS.createPath;
      Module["FS_createDataFile"] = FS.createDataFile;
      Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
      Module["FS_createLazyFile"] = FS.createLazyFile;
      Module["FS_createDevice"] = FS.createDevice;
      Module["FS_unlink"] = FS.unlink;

      function intArrayFromString(stringy, dontAddNull, length) {
        var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
        if (dontAddNull) u8array.length = numBytesWritten;
        return u8array
      }
      var asmLibraryArg = {
        "ia": ___syscall_access,
        "ha": ___syscall_chdir,
        "ga": ___syscall_chmod,
        "fa": ___syscall_dup3,
        "l": ___syscall_fcntl64,
        "$": ___syscall_fstat64,
        "Z": ___syscall_fstatat64,
        "X": ___syscall_ftruncate64,
        "W": ___syscall_getcwd,
        "Q": ___syscall_getdents64,
        "V": ___syscall_getuid32,
        "x": ___syscall_ioctl,
        "Y": ___syscall_lstat64,
        "U": ___syscall_mkdir,
        "T": ___syscall_mmap2,
        "S": ___syscall_munmap,
        "y": ___syscall_open,
        "R": ___syscall_poll,
        "P": ___syscall_readlink,
        "N": ___syscall_rename,
        "t": ___syscall_rmdir,
        "_": ___syscall_stat64,
        "O": ___syscall_unlink,
        "z": __dlopen_js,
        "ea": __dlsym_js,
        "K": __emscripten_throw_longjmp,
        "aa": __localtime_js,
        "ba": __mktime_js,
        "ca": __tzset_js,
        "r": _abort,
        "B": _clock_gettime,
        "M": _emscripten_get_heap_max,
        "u": _emscripten_get_now,
        "da": _emscripten_memcpy_big,
        "L": _emscripten_resize_heap,
        "ja": _environ_get,
        "ka": _environ_sizes_get,
        "m": _exit,
        "n": _fd_close,
        "v": _fd_fdstat_get,
        "w": _fd_read,
        "G": _fd_seek,
        "q": _fd_write,
        "b": _getTempRet0,
        "A": _gettimeofday,
        "h": invoke_i,
        "c": invoke_ii,
        "d": invoke_iii,
        "g": invoke_iiii,
        "i": invoke_iiiii,
        "j": invoke_iiiiii,
        "C": invoke_iiiiiii,
        "s": invoke_iiiiiiii,
        "D": invoke_iiiiiiiii,
        "E": invoke_iiiiiiiiii,
        "F": invoke_iiiiiiiiiii,
        "ma": invoke_iiiiiiiiiiii,
        "I": invoke_iij,
        "J": invoke_iiji,
        "H": invoke_ij,
        "k": invoke_v,
        "f": invoke_vi,
        "e": invoke_vii,
        "o": invoke_viii,
        "a": _setTempRet0,
        "la": _strftime,
        "p": _time
      };
      var asm = createWasm();
      var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
        return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["oa"]).apply(null, arguments)
      };
      var _malloc = Module["_malloc"] = function() {
        return (_malloc = Module["_malloc"] = Module["asm"]["pa"]).apply(null, arguments)
      };
      var _PL_initialise = Module["_PL_initialise"] = function() {
        return (_PL_initialise = Module["_PL_initialise"] = Module["asm"]["qa"]).apply(null, arguments)
      };
      var _PL_halt = Module["_PL_halt"] = function() {
        return (_PL_halt = Module["_PL_halt"] = Module["asm"]["ra"]).apply(null, arguments)
      };
      var _PL_toplevel = Module["_PL_toplevel"] = function() {
        return (_PL_toplevel = Module["_PL_toplevel"] = Module["asm"]["sa"]).apply(null, arguments)
      };
      var _PL_unregister_blob_type = Module["_PL_unregister_blob_type"] = function() {
        return (_PL_unregister_blob_type = Module["_PL_unregister_blob_type"] = Module["asm"]["ta"]).apply(null, arguments)
      };
      var _PL_unregister_atom = Module["_PL_unregister_atom"] = function() {
        return (_PL_unregister_atom = Module["_PL_unregister_atom"] = Module["asm"]["ua"]).apply(null, arguments)
      };
      var _PL_agc_hook = Module["_PL_agc_hook"] = function() {
        return (_PL_agc_hook = Module["_PL_agc_hook"] = Module["asm"]["va"]).apply(null, arguments)
      };
      var _PL_register_atom = Module["_PL_register_atom"] = function() {
        return (_PL_register_atom = Module["_PL_register_atom"] = Module["asm"]["wa"]).apply(null, arguments)
      };
      var _PL_open_foreign_frame = Module["_PL_open_foreign_frame"] = function() {
        return (_PL_open_foreign_frame = Module["_PL_open_foreign_frame"] = Module["asm"]["xa"]).apply(null, arguments)
      };
      var _PL_close_foreign_frame = Module["_PL_close_foreign_frame"] = function() {
        return (_PL_close_foreign_frame = Module["_PL_close_foreign_frame"] = Module["asm"]["ya"]).apply(null, arguments)
      };
      var _PL_rewind_foreign_frame = Module["_PL_rewind_foreign_frame"] = function() {
        return (_PL_rewind_foreign_frame = Module["_PL_rewind_foreign_frame"] = Module["asm"]["za"]).apply(null, arguments)
      };
      var _PL_discard_foreign_frame = Module["_PL_discard_foreign_frame"] = function() {
        return (_PL_discard_foreign_frame = Module["_PL_discard_foreign_frame"] = Module["asm"]["Aa"]).apply(null, arguments)
      };
      var _PL_open_query = Module["_PL_open_query"] = function() {
        return (_PL_open_query = Module["_PL_open_query"] = Module["asm"]["Ba"]).apply(null, arguments)
      };
      var _PL_exception = Module["_PL_exception"] = function() {
        return (_PL_exception = Module["_PL_exception"] = Module["asm"]["Ca"]).apply(null, arguments)
      };
      var _PL_cut_query = Module["_PL_cut_query"] = function() {
        return (_PL_cut_query = Module["_PL_cut_query"] = Module["asm"]["Da"]).apply(null, arguments)
      };
      var _PL_close_query = Module["_PL_close_query"] = function() {
        return (_PL_close_query = Module["_PL_close_query"] = Module["asm"]["Ea"]).apply(null, arguments)
      };
      var _PL_current_query = Module["_PL_current_query"] = function() {
        return (_PL_current_query = Module["_PL_current_query"] = Module["asm"]["Fa"]).apply(null, arguments)
      };
      var _PL_next_solution = Module["_PL_next_solution"] = function() {
        return (_PL_next_solution = Module["_PL_next_solution"] = Module["asm"]["Ga"]).apply(null, arguments)
      };
      var _PL_instantiation_error = Module["_PL_instantiation_error"] = function() {
        return (_PL_instantiation_error = Module["_PL_instantiation_error"] = Module["asm"]["Ha"]).apply(null, arguments)
      };
      var _PL_uninstantiation_error = Module["_PL_uninstantiation_error"] = function() {
        return (_PL_uninstantiation_error = Module["_PL_uninstantiation_error"] = Module["asm"]["Ia"]).apply(null, arguments)
      };
      var _PL_representation_error = Module["_PL_representation_error"] = function() {
        return (_PL_representation_error = Module["_PL_representation_error"] = Module["asm"]["Ja"]).apply(null, arguments)
      };
      var _PL_type_error = Module["_PL_type_error"] = function() {
        return (_PL_type_error = Module["_PL_type_error"] = Module["asm"]["Ka"]).apply(null, arguments)
      };
      var _PL_domain_error = Module["_PL_domain_error"] = function() {
        return (_PL_domain_error = Module["_PL_domain_error"] = Module["asm"]["La"]).apply(null, arguments)
      };
      var _PL_existence_error = Module["_PL_existence_error"] = function() {
        return (_PL_existence_error = Module["_PL_existence_error"] = Module["asm"]["Ma"]).apply(null, arguments)
      };
      var _PL_permission_error = Module["_PL_permission_error"] = function() {
        return (_PL_permission_error = Module["_PL_permission_error"] = Module["asm"]["Na"]).apply(null, arguments)
      };
      var _PL_resource_error = Module["_PL_resource_error"] = function() {
        return (_PL_resource_error = Module["_PL_resource_error"] = Module["asm"]["Oa"]).apply(null, arguments)
      };
      var _PL_syntax_error = Module["_PL_syntax_error"] = function() {
        return (_PL_syntax_error = Module["_PL_syntax_error"] = Module["asm"]["Pa"]).apply(null, arguments)
      };
      var _PL_get_atom_ex = Module["_PL_get_atom_ex"] = function() {
        return (_PL_get_atom_ex = Module["_PL_get_atom_ex"] = Module["asm"]["Qa"]).apply(null, arguments)
      };
      var _PL_get_integer_ex = Module["_PL_get_integer_ex"] = function() {
        return (_PL_get_integer_ex = Module["_PL_get_integer_ex"] = Module["asm"]["Ra"]).apply(null, arguments)
      };
      var _PL_get_long_ex = Module["_PL_get_long_ex"] = function() {
        return (_PL_get_long_ex = Module["_PL_get_long_ex"] = Module["asm"]["Sa"]).apply(null, arguments)
      };
      var _PL_get_int64_ex = Module["_PL_get_int64_ex"] = function() {
        return (_PL_get_int64_ex = Module["_PL_get_int64_ex"] = Module["asm"]["Ta"]).apply(null, arguments)
      };
      var _PL_get_intptr_ex = Module["_PL_get_intptr_ex"] = function() {
        return (_PL_get_intptr_ex = Module["_PL_get_intptr_ex"] = Module["asm"]["Ua"]).apply(null, arguments)
      };
      var _PL_get_size_ex = Module["_PL_get_size_ex"] = function() {
        return (_PL_get_size_ex = Module["_PL_get_size_ex"] = Module["asm"]["Va"]).apply(null, arguments)
      };
      var _PL_get_bool_ex = Module["_PL_get_bool_ex"] = function() {
        return (_PL_get_bool_ex = Module["_PL_get_bool_ex"] = Module["asm"]["Wa"]).apply(null, arguments)
      };
      var _PL_get_float_ex = Module["_PL_get_float_ex"] = function() {
        return (_PL_get_float_ex = Module["_PL_get_float_ex"] = Module["asm"]["Xa"]).apply(null, arguments)
      };
      var _PL_get_char_ex = Module["_PL_get_char_ex"] = function() {
        return (_PL_get_char_ex = Module["_PL_get_char_ex"] = Module["asm"]["Ya"]).apply(null, arguments)
      };
      var _PL_get_pointer_ex = Module["_PL_get_pointer_ex"] = function() {
        return (_PL_get_pointer_ex = Module["_PL_get_pointer_ex"] = Module["asm"]["Za"]).apply(null, arguments)
      };
      var _PL_unify_list_ex = Module["_PL_unify_list_ex"] = function() {
        return (_PL_unify_list_ex = Module["_PL_unify_list_ex"] = Module["asm"]["_a"]).apply(null, arguments)
      };
      var _PL_unify_nil_ex = Module["_PL_unify_nil_ex"] = function() {
        return (_PL_unify_nil_ex = Module["_PL_unify_nil_ex"] = Module["asm"]["$a"]).apply(null, arguments)
      };
      var _PL_get_list_ex = Module["_PL_get_list_ex"] = function() {
        return (_PL_get_list_ex = Module["_PL_get_list_ex"] = Module["asm"]["ab"]).apply(null, arguments)
      };
      var _PL_get_nil_ex = Module["_PL_get_nil_ex"] = function() {
        return (_PL_get_nil_ex = Module["_PL_get_nil_ex"] = Module["asm"]["bb"]).apply(null, arguments)
      };
      var _PL_unify_bool_ex = Module["_PL_unify_bool_ex"] = function() {
        return (_PL_unify_bool_ex = Module["_PL_unify_bool_ex"] = Module["asm"]["cb"]).apply(null, arguments)
      };
      var _PL_is_ground = Module["_PL_is_ground"] = function() {
        return (_PL_is_ground = Module["_PL_is_ground"] = Module["asm"]["db"]).apply(null, arguments)
      };
      var _PL_is_acyclic = Module["_PL_is_acyclic"] = function() {
        return (_PL_is_acyclic = Module["_PL_is_acyclic"] = Module["asm"]["eb"]).apply(null, arguments)
      };
      var _PL_chars_to_term = Module["_PL_chars_to_term"] = function() {
        return (_PL_chars_to_term = Module["_PL_chars_to_term"] = Module["asm"]["fb"]).apply(null, arguments)
      };
      var _PL_wchars_to_term = Module["_PL_wchars_to_term"] = function() {
        return (_PL_wchars_to_term = Module["_PL_wchars_to_term"] = Module["asm"]["gb"]).apply(null, arguments)
      };
      var _PL_record_external = Module["_PL_record_external"] = function() {
        return (_PL_record_external = Module["_PL_record_external"] = Module["asm"]["hb"]).apply(null, arguments)
      };
      var _PL_recorded_external = Module["_PL_recorded_external"] = function() {
        return (_PL_recorded_external = Module["_PL_recorded_external"] = Module["asm"]["ib"]).apply(null, arguments)
      };
      var _PL_erase_external = Module["_PL_erase_external"] = function() {
        return (_PL_erase_external = Module["_PL_erase_external"] = Module["asm"]["jb"]).apply(null, arguments)
      };
      var _PL_sigaction = Module["_PL_sigaction"] = function() {
        return (_PL_sigaction = Module["_PL_sigaction"] = Module["asm"]["kb"]).apply(null, arguments)
      };
      var _PL_get_signum_ex = Module["_PL_get_signum_ex"] = function() {
        return (_PL_get_signum_ex = Module["_PL_get_signum_ex"] = Module["asm"]["lb"]).apply(null, arguments)
      };
      var _PL_signal = Module["_PL_signal"] = function() {
        return (_PL_signal = Module["_PL_signal"] = Module["asm"]["mb"]).apply(null, arguments)
      };
      var _PL_handle_signals = Module["_PL_handle_signals"] = function() {
        return (_PL_handle_signals = Module["_PL_handle_signals"] = Module["asm"]["nb"]).apply(null, arguments)
      };
      var _PL_cleanup_fork = Module["_PL_cleanup_fork"] = function() {
        return (_PL_cleanup_fork = Module["_PL_cleanup_fork"] = Module["asm"]["ob"]).apply(null, arguments)
      };
      var _PL_is_initialised = Module["_PL_is_initialised"] = function() {
        return (_PL_is_initialised = Module["_PL_is_initialised"] = Module["asm"]["pb"]).apply(null, arguments)
      };
      var _free = Module["_free"] = function() {
        return (_free = Module["_free"] = Module["asm"]["qb"]).apply(null, arguments)
      };
      var _PL_raise = Module["_PL_raise"] = function() {
        return (_PL_raise = Module["_PL_raise"] = Module["asm"]["rb"]).apply(null, arguments)
      };
      var _PL_new_atom = Module["_PL_new_atom"] = function() {
        return (_PL_new_atom = Module["_PL_new_atom"] = Module["asm"]["sb"]).apply(null, arguments)
      };
      var ___errno_location = Module["___errno_location"] = function() {
        return (___errno_location = Module["___errno_location"] = Module["asm"]["tb"]).apply(null, arguments)
      };
      var _PL_put_atom_chars = Module["_PL_put_atom_chars"] = function() {
        return (_PL_put_atom_chars = Module["_PL_put_atom_chars"] = Module["asm"]["ub"]).apply(null, arguments)
      };
      var _PL_throw = Module["_PL_throw"] = function() {
        return (_PL_throw = Module["_PL_throw"] = Module["asm"]["vb"]).apply(null, arguments)
      };
      var _PL_raise_exception = Module["_PL_raise_exception"] = function() {
        return (_PL_raise_exception = Module["_PL_raise_exception"] = Module["asm"]["wb"]).apply(null, arguments)
      };
      var _PL_clear_exception = Module["_PL_clear_exception"] = function() {
        return (_PL_clear_exception = Module["_PL_clear_exception"] = Module["asm"]["xb"]).apply(null, arguments)
      };
      var _PL_put_nil = Module["_PL_put_nil"] = function() {
        return (_PL_put_nil = Module["_PL_put_nil"] = Module["asm"]["yb"]).apply(null, arguments)
      };
      var _PL_atom_nchars = Module["_PL_atom_nchars"] = function() {
        return (_PL_atom_nchars = Module["_PL_atom_nchars"] = Module["asm"]["zb"]).apply(null, arguments)
      };
      var _PL_atom_wchars = Module["_PL_atom_wchars"] = function() {
        return (_PL_atom_wchars = Module["_PL_atom_wchars"] = Module["asm"]["Ab"]).apply(null, arguments)
      };
      var _PL_unify_nil = Module["_PL_unify_nil"] = function() {
        return (_PL_unify_nil = Module["_PL_unify_nil"] = Module["asm"]["Bb"]).apply(null, arguments)
      };
      var _PL_cons_functor_v = Module["_PL_cons_functor_v"] = function() {
        return (_PL_cons_functor_v = Module["_PL_cons_functor_v"] = Module["asm"]["Cb"]).apply(null, arguments)
      };
      var _PL_get_nil = Module["_PL_get_nil"] = function() {
        return (_PL_get_nil = Module["_PL_get_nil"] = Module["asm"]["Db"]).apply(null, arguments)
      };
      var _PL_atom_chars = Module["_PL_atom_chars"] = function() {
        return (_PL_atom_chars = Module["_PL_atom_chars"] = Module["asm"]["Eb"]).apply(null, arguments)
      };
      var _PL_is_list = Module["_PL_is_list"] = function() {
        return (_PL_is_list = Module["_PL_is_list"] = Module["asm"]["Fb"]).apply(null, arguments)
      };
      var _PL_cons_functor = Module["_PL_cons_functor"] = function() {
        return (_PL_cons_functor = Module["_PL_cons_functor"] = Module["asm"]["Gb"]).apply(null, arguments)
      };
      var _PL_warning = Module["_PL_warning"] = function() {
        return (_PL_warning = Module["_PL_warning"] = Module["asm"]["Hb"]).apply(null, arguments)
      };
      var _PL_is_integer = Module["_PL_is_integer"] = function() {
        return (_PL_is_integer = Module["_PL_is_integer"] = Module["asm"]["Ib"]).apply(null, arguments)
      };
      var _PL_unify_chars = Module["_PL_unify_chars"] = function() {
        return (_PL_unify_chars = Module["_PL_unify_chars"] = Module["asm"]["Kb"]).apply(null, arguments)
      };
      var _PL_unify_float = Module["_PL_unify_float"] = function() {
        return (_PL_unify_float = Module["_PL_unify_float"] = Module["asm"]["Lb"]).apply(null, arguments)
      };
      var _PL_get_nchars = Module["_PL_get_nchars"] = function() {
        return (_PL_get_nchars = Module["_PL_get_nchars"] = Module["asm"]["Mb"]).apply(null, arguments)
      };
      var _PL_get_wchars = Module["_PL_get_wchars"] = function() {
        return (_PL_get_wchars = Module["_PL_get_wchars"] = Module["asm"]["Nb"]).apply(null, arguments)
      };
      var _PL_call_predicate = Module["_PL_call_predicate"] = function() {
        return (_PL_call_predicate = Module["_PL_call_predicate"] = Module["asm"]["Ob"]).apply(null, arguments)
      };
      var _PL_is_number = Module["_PL_is_number"] = function() {
        return (_PL_is_number = Module["_PL_is_number"] = Module["asm"]["Pb"]).apply(null, arguments)
      };
      var _PL_is_string = Module["_PL_is_string"] = function() {
        return (_PL_is_string = Module["_PL_is_string"] = Module["asm"]["Qb"]).apply(null, arguments)
      };
      var _PL_is_pair = Module["_PL_is_pair"] = function() {
        return (_PL_is_pair = Module["_PL_is_pair"] = Module["asm"]["Rb"]).apply(null, arguments)
      };
      var _PL_predicate = Module["_PL_predicate"] = function() {
        return (_PL_predicate = Module["_PL_predicate"] = Module["asm"]["Sb"]).apply(null, arguments)
      };
      var _PL_is_float = Module["_PL_is_float"] = function() {
        return (_PL_is_float = Module["_PL_is_float"] = Module["asm"]["Tb"]).apply(null, arguments)
      };
      var _PL_is_compound = Module["_PL_is_compound"] = function() {
        return (_PL_is_compound = Module["_PL_is_compound"] = Module["asm"]["Ub"]).apply(null, arguments)
      };
      var _PL_is_callable = Module["_PL_is_callable"] = function() {
        return (_PL_is_callable = Module["_PL_is_callable"] = Module["asm"]["Vb"]).apply(null, arguments)
      };
      var _PL_unify_compound = Module["_PL_unify_compound"] = function() {
        return (_PL_unify_compound = Module["_PL_unify_compound"] = Module["asm"]["Wb"]).apply(null, arguments)
      };
      var _PL_compare = Module["_PL_compare"] = function() {
        return (_PL_compare = Module["_PL_compare"] = Module["asm"]["Xb"]).apply(null, arguments)
      };
      var _PL_unify_uint64 = Module["_PL_unify_uint64"] = function() {
        return (_PL_unify_uint64 = Module["_PL_unify_uint64"] = Module["asm"]["Yb"]).apply(null, arguments)
      };
      var _PL_unify_atom_nchars = Module["_PL_unify_atom_nchars"] = function() {
        return (_PL_unify_atom_nchars = Module["_PL_unify_atom_nchars"] = Module["asm"]["Zb"]).apply(null, arguments)
      };
      var _PL_unify_wchars = Module["_PL_unify_wchars"] = function() {
        return (_PL_unify_wchars = Module["_PL_unify_wchars"] = Module["asm"]["_b"]).apply(null, arguments)
      };
      var _PL_get_atom_chars = Module["_PL_get_atom_chars"] = function() {
        return (_PL_get_atom_chars = Module["_PL_get_atom_chars"] = Module["asm"]["$b"]).apply(null, arguments)
      };
      var _PL_unify_bool = Module["_PL_unify_bool"] = function() {
        return (_PL_unify_bool = Module["_PL_unify_bool"] = Module["asm"]["ac"]).apply(null, arguments)
      };
      var _PL_get_chars = Module["_PL_get_chars"] = function() {
        return (_PL_get_chars = Module["_PL_get_chars"] = Module["asm"]["bc"]).apply(null, arguments)
      };
      var _PL_skip_list = Module["_PL_skip_list"] = function() {
        return (_PL_skip_list = Module["_PL_skip_list"] = Module["asm"]["cc"]).apply(null, arguments)
      };
      var _PL_is_atom = Module["_PL_is_atom"] = function() {
        return (_PL_is_atom = Module["_PL_is_atom"] = Module["asm"]["dc"]).apply(null, arguments)
      };
      var _PL_is_variable = Module["_PL_is_variable"] = function() {
        return (_PL_is_variable = Module["_PL_is_variable"] = Module["asm"]["ec"]).apply(null, arguments)
      };
      var _PL_unify_atom = Module["_PL_unify_atom"] = function() {
        return (_PL_unify_atom = Module["_PL_unify_atom"] = Module["asm"]["fc"]).apply(null, arguments)
      };
      var _PL_new_term_refs = Module["_PL_new_term_refs"] = function() {
        return (_PL_new_term_refs = Module["_PL_new_term_refs"] = Module["asm"]["gc"]).apply(null, arguments)
      };
      var _PL_put_atom = Module["_PL_put_atom"] = function() {
        return (_PL_put_atom = Module["_PL_put_atom"] = Module["asm"]["hc"]).apply(null, arguments)
      };
      var _PL_new_term_ref = Module["_PL_new_term_ref"] = function() {
        return (_PL_new_term_ref = Module["_PL_new_term_ref"] = Module["asm"]["ic"]).apply(null, arguments)
      };
      var _PL_unify = Module["_PL_unify"] = function() {
        return (_PL_unify = Module["_PL_unify"] = Module["asm"]["jc"]).apply(null, arguments)
      };
      var _PL_get_bool = Module["_PL_get_bool"] = function() {
        return (_PL_get_bool = Module["_PL_get_bool"] = Module["asm"]["kc"]).apply(null, arguments)
      };
      var _PL_get_float = Module["_PL_get_float"] = function() {
        return (_PL_get_float = Module["_PL_get_float"] = Module["asm"]["lc"]).apply(null, arguments)
      };
      var _PL_get_module = Module["_PL_get_module"] = function() {
        return (_PL_get_module = Module["_PL_get_module"] = Module["asm"]["mc"]).apply(null, arguments)
      };
      var _PL_erase = Module["_PL_erase"] = function() {
        return (_PL_erase = Module["_PL_erase"] = Module["asm"]["nc"]).apply(null, arguments)
      };
      var _PL_unify_string_nchars = Module["_PL_unify_string_nchars"] = function() {
        return (_PL_unify_string_nchars = Module["_PL_unify_string_nchars"] = Module["asm"]["oc"]).apply(null, arguments)
      };
      var _PL_get_intptr = Module["_PL_get_intptr"] = function() {
        return (_PL_get_intptr = Module["_PL_get_intptr"] = Module["asm"]["pc"]).apply(null, arguments)
      };
      var _PL_pred = Module["_PL_pred"] = function() {
        return (_PL_pred = Module["_PL_pred"] = Module["asm"]["qc"]).apply(null, arguments)
      };
      var _PL_is_blob = Module["_PL_is_blob"] = function() {
        return (_PL_is_blob = Module["_PL_is_blob"] = Module["asm"]["rc"]).apply(null, arguments)
      };
      var _PL_unify_atom_chars = Module["_PL_unify_atom_chars"] = function() {
        return (_PL_unify_atom_chars = Module["_PL_unify_atom_chars"] = Module["asm"]["sc"]).apply(null, arguments)
      };
      var _PL_put_float = Module["_PL_put_float"] = function() {
        return (_PL_put_float = Module["_PL_put_float"] = Module["asm"]["tc"]).apply(null, arguments)
      };
      var _PL_put_pointer = Module["_PL_put_pointer"] = function() {
        return (_PL_put_pointer = Module["_PL_put_pointer"] = Module["asm"]["uc"]).apply(null, arguments)
      };
      var _PL_unify_int64 = Module["_PL_unify_int64"] = function() {
        return (_PL_unify_int64 = Module["_PL_unify_int64"] = Module["asm"]["vc"]).apply(null, arguments)
      };
      var _PL_get_atom = Module["_PL_get_atom"] = function() {
        return (_PL_get_atom = Module["_PL_get_atom"] = Module["asm"]["wc"]).apply(null, arguments)
      };
      var _PL_copy_term_ref = Module["_PL_copy_term_ref"] = function() {
        return (_PL_copy_term_ref = Module["_PL_copy_term_ref"] = Module["asm"]["xc"]).apply(null, arguments)
      };
      var _PL_unify_integer = Module["_PL_unify_integer"] = function() {
        return (_PL_unify_integer = Module["_PL_unify_integer"] = Module["asm"]["yc"]).apply(null, arguments)
      };
      var _PL_put_int64 = Module["_PL_put_int64"] = function() {
        return (_PL_put_int64 = Module["_PL_put_int64"] = Module["asm"]["zc"]).apply(null, arguments)
      };
      var _PL_set_prolog_flag = Module["_PL_set_prolog_flag"] = function() {
        return (_PL_set_prolog_flag = Module["_PL_set_prolog_flag"] = Module["asm"]["Ac"]).apply(null, arguments)
      };
      var _PL_get_file_name = Module["_PL_get_file_name"] = function() {
        return (_PL_get_file_name = Module["_PL_get_file_name"] = Module["asm"]["Bc"]).apply(null, arguments)
      };
      var _PL_unify_blob = Module["_PL_unify_blob"] = function() {
        return (_PL_unify_blob = Module["_PL_unify_blob"] = Module["asm"]["Cc"]).apply(null, arguments)
      };
      var _PL_get_blob = Module["_PL_get_blob"] = function() {
        return (_PL_get_blob = Module["_PL_get_blob"] = Module["asm"]["Dc"]).apply(null, arguments)
      };
      var _PL_blob_data = Module["_PL_blob_data"] = function() {
        return (_PL_blob_data = Module["_PL_blob_data"] = Module["asm"]["Ec"]).apply(null, arguments)
      };
      var _PL_new_module = Module["_PL_new_module"] = function() {
        return (_PL_new_module = Module["_PL_new_module"] = Module["asm"]["Fc"]).apply(null, arguments)
      };
      var _PL_put_string_chars = Module["_PL_put_string_chars"] = function() {
        return (_PL_put_string_chars = Module["_PL_put_string_chars"] = Module["asm"]["Gc"]).apply(null, arguments)
      };
      var _PL_set_resource_db_mem = Module["_PL_set_resource_db_mem"] = function() {
        return (_PL_set_resource_db_mem = Module["_PL_set_resource_db_mem"] = Module["asm"]["Hc"]).apply(null, arguments)
      };
      var _PL_on_halt = Module["_PL_on_halt"] = function() {
        return (_PL_on_halt = Module["_PL_on_halt"] = Module["asm"]["Ic"]).apply(null, arguments)
      };
      var _PL_exit_hook = Module["_PL_exit_hook"] = function() {
        return (_PL_exit_hook = Module["_PL_exit_hook"] = Module["asm"]["Jc"]).apply(null, arguments)
      };
      var _PL_cleanup = Module["_PL_cleanup"] = function() {
        return (_PL_cleanup = Module["_PL_cleanup"] = Module["asm"]["Kc"]).apply(null, arguments)
      };
      var _PL_unify_string_chars = Module["_PL_unify_string_chars"] = function() {
        return (_PL_unify_string_chars = Module["_PL_unify_string_chars"] = Module["asm"]["Lc"]).apply(null, arguments)
      };
      var _PL_put_variable = Module["_PL_put_variable"] = function() {
        return (_PL_put_variable = Module["_PL_put_variable"] = Module["asm"]["Mc"]).apply(null, arguments)
      };
      var _PL_is_atomic = Module["_PL_is_atomic"] = function() {
        return (_PL_is_atomic = Module["_PL_is_atomic"] = Module["asm"]["Nc"]).apply(null, arguments)
      };
      var _PL_recorded = Module["_PL_recorded"] = function() {
        return (_PL_recorded = Module["_PL_recorded"] = Module["asm"]["Oc"]).apply(null, arguments)
      };
      var _PL_record = Module["_PL_record"] = function() {
        return (_PL_record = Module["_PL_record"] = Module["asm"]["Pc"]).apply(null, arguments)
      };
      var _PL_put_functor = Module["_PL_put_functor"] = function() {
        return (_PL_put_functor = Module["_PL_put_functor"] = Module["asm"]["Qc"]).apply(null, arguments)
      };
      var _PL_strip_module = Module["_PL_strip_module"] = function() {
        return (_PL_strip_module = Module["_PL_strip_module"] = Module["asm"]["Rc"]).apply(null, arguments)
      };
      var _PL_unify_list = Module["_PL_unify_list"] = function() {
        return (_PL_unify_list = Module["_PL_unify_list"] = Module["asm"]["Sc"]).apply(null, arguments)
      };
      var _PL_register_foreign_in_module = Module["_PL_register_foreign_in_module"] = function() {
        return (_PL_register_foreign_in_module = Module["_PL_register_foreign_in_module"] = Module["asm"]["Tc"]).apply(null, arguments)
      };
      var _PL_foreign_control = Module["_PL_foreign_control"] = function() {
        return (_PL_foreign_control = Module["_PL_foreign_control"] = Module["asm"]["Uc"]).apply(null, arguments)
      };
      var _PL_foreign_context_address = Module["_PL_foreign_context_address"] = function() {
        return (_PL_foreign_context_address = Module["_PL_foreign_context_address"] = Module["asm"]["Vc"]).apply(null, arguments)
      };
      var _PL_reset_term_refs = Module["_PL_reset_term_refs"] = function() {
        return (_PL_reset_term_refs = Module["_PL_reset_term_refs"] = Module["asm"]["Wc"]).apply(null, arguments)
      };
      var _PL_new_atom_nchars = Module["_PL_new_atom_nchars"] = function() {
        return (_PL_new_atom_nchars = Module["_PL_new_atom_nchars"] = Module["asm"]["Xc"]).apply(null, arguments)
      };
      var _PL_new_atom_mbchars = Module["_PL_new_atom_mbchars"] = function() {
        return (_PL_new_atom_mbchars = Module["_PL_new_atom_mbchars"] = Module["asm"]["Yc"]).apply(null, arguments)
      };
      var _PL_new_functor = Module["_PL_new_functor"] = function() {
        return (_PL_new_functor = Module["_PL_new_functor"] = Module["asm"]["Zc"]).apply(null, arguments)
      };
      var _PL_functor_name = Module["_PL_functor_name"] = function() {
        return (_PL_functor_name = Module["_PL_functor_name"] = Module["asm"]["_c"]).apply(null, arguments)
      };
      var _PL_functor_arity = Module["_PL_functor_arity"] = function() {
        return (_PL_functor_arity = Module["_PL_functor_arity"] = Module["asm"]["$c"]).apply(null, arguments)
      };
      var _PL_new_atom_wchars = Module["_PL_new_atom_wchars"] = function() {
        return (_PL_new_atom_wchars = Module["_PL_new_atom_wchars"] = Module["asm"]["ad"]).apply(null, arguments)
      };
      var _PL_unify_wchars_diff = Module["_PL_unify_wchars_diff"] = function() {
        return (_PL_unify_wchars_diff = Module["_PL_unify_wchars_diff"] = Module["asm"]["bd"]).apply(null, arguments)
      };
      var _PL_same_compound = Module["_PL_same_compound"] = function() {
        return (_PL_same_compound = Module["_PL_same_compound"] = Module["asm"]["cd"]).apply(null, arguments)
      };
      var _PL_cons_list = Module["_PL_cons_list"] = function() {
        return (_PL_cons_list = Module["_PL_cons_list"] = Module["asm"]["dd"]).apply(null, arguments)
      };
      var _PL_get_atom_nchars = Module["_PL_get_atom_nchars"] = function() {
        return (_PL_get_atom_nchars = Module["_PL_get_atom_nchars"] = Module["asm"]["ed"]).apply(null, arguments)
      };
      var _PL_get_list_nchars = Module["_PL_get_list_nchars"] = function() {
        return (_PL_get_list_nchars = Module["_PL_get_list_nchars"] = Module["asm"]["fd"]).apply(null, arguments)
      };
      var _PL_get_list_chars = Module["_PL_get_list_chars"] = function() {
        return (_PL_get_list_chars = Module["_PL_get_list_chars"] = Module["asm"]["gd"]).apply(null, arguments)
      };
      var _PL_quote = Module["_PL_quote"] = function() {
        return (_PL_quote = Module["_PL_quote"] = Module["asm"]["hd"]).apply(null, arguments)
      };
      var _PL_get_integer = Module["_PL_get_integer"] = function() {
        return (_PL_get_integer = Module["_PL_get_integer"] = Module["asm"]["id"]).apply(null, arguments)
      };
      var _PL_get_long = Module["_PL_get_long"] = function() {
        return (_PL_get_long = Module["_PL_get_long"] = Module["asm"]["jd"]).apply(null, arguments)
      };
      var _PL_get_int64 = Module["_PL_get_int64"] = function() {
        return (_PL_get_int64 = Module["_PL_get_int64"] = Module["asm"]["kd"]).apply(null, arguments)
      };
      var _PL_get_pointer = Module["_PL_get_pointer"] = function() {
        return (_PL_get_pointer = Module["_PL_get_pointer"] = Module["asm"]["ld"]).apply(null, arguments)
      };
      var _PL_get_name_arity = Module["_PL_get_name_arity"] = function() {
        return (_PL_get_name_arity = Module["_PL_get_name_arity"] = Module["asm"]["md"]).apply(null, arguments)
      };
      var _PL_get_compound_name_arity = Module["_PL_get_compound_name_arity"] = function() {
        return (_PL_get_compound_name_arity = Module["_PL_get_compound_name_arity"] = Module["asm"]["nd"]).apply(null, arguments)
      };
      var _PL_get_functor = Module["_PL_get_functor"] = function() {
        return (_PL_get_functor = Module["_PL_get_functor"] = Module["asm"]["od"]).apply(null, arguments)
      };
      var _PL_get_arg = Module["_PL_get_arg"] = function() {
        return (_PL_get_arg = Module["_PL_get_arg"] = Module["asm"]["pd"]).apply(null, arguments)
      };
      var _PL_get_list = Module["_PL_get_list"] = function() {
        return (_PL_get_list = Module["_PL_get_list"] = Module["asm"]["qd"]).apply(null, arguments)
      };
      var _PL_get_head = Module["_PL_get_head"] = function() {
        return (_PL_get_head = Module["_PL_get_head"] = Module["asm"]["rd"]).apply(null, arguments)
      };
      var _PL_get_tail = Module["_PL_get_tail"] = function() {
        return (_PL_get_tail = Module["_PL_get_tail"] = Module["asm"]["sd"]).apply(null, arguments)
      };
      var _PL_is_functor = Module["_PL_is_functor"] = function() {
        return (_PL_is_functor = Module["_PL_is_functor"] = Module["asm"]["td"]).apply(null, arguments)
      };
      var _PL_put_bool = Module["_PL_put_bool"] = function() {
        return (_PL_put_bool = Module["_PL_put_bool"] = Module["asm"]["ud"]).apply(null, arguments)
      };
      var _PL_put_atom_nchars = Module["_PL_put_atom_nchars"] = function() {
        return (_PL_put_atom_nchars = Module["_PL_put_atom_nchars"] = Module["asm"]["vd"]).apply(null, arguments)
      };
      var _PL_put_string_nchars = Module["_PL_put_string_nchars"] = function() {
        return (_PL_put_string_nchars = Module["_PL_put_string_nchars"] = Module["asm"]["wd"]).apply(null, arguments)
      };
      var _PL_put_chars = Module["_PL_put_chars"] = function() {
        return (_PL_put_chars = Module["_PL_put_chars"] = Module["asm"]["xd"]).apply(null, arguments)
      };
      var _PL_put_list_ncodes = Module["_PL_put_list_ncodes"] = function() {
        return (_PL_put_list_ncodes = Module["_PL_put_list_ncodes"] = Module["asm"]["yd"]).apply(null, arguments)
      };
      var _PL_put_list_nchars = Module["_PL_put_list_nchars"] = function() {
        return (_PL_put_list_nchars = Module["_PL_put_list_nchars"] = Module["asm"]["zd"]).apply(null, arguments)
      };
      var _PL_put_list_chars = Module["_PL_put_list_chars"] = function() {
        return (_PL_put_list_chars = Module["_PL_put_list_chars"] = Module["asm"]["Ad"]).apply(null, arguments)
      };
      var _PL_put_integer = Module["_PL_put_integer"] = function() {
        return (_PL_put_integer = Module["_PL_put_integer"] = Module["asm"]["Bd"]).apply(null, arguments)
      };
      var _PL_put_list = Module["_PL_put_list"] = function() {
        return (_PL_put_list = Module["_PL_put_list"] = Module["asm"]["Cd"]).apply(null, arguments)
      };
      var _PL_put_term = Module["_PL_put_term"] = function() {
        return (_PL_put_term = Module["_PL_put_term"] = Module["asm"]["Dd"]).apply(null, arguments)
      };
      var _PL_unify_functor = Module["_PL_unify_functor"] = function() {
        return (_PL_unify_functor = Module["_PL_unify_functor"] = Module["asm"]["Ed"]).apply(null, arguments)
      };
      var _PL_unify_list_ncodes = Module["_PL_unify_list_ncodes"] = function() {
        return (_PL_unify_list_ncodes = Module["_PL_unify_list_ncodes"] = Module["asm"]["Fd"]).apply(null, arguments)
      };
      var _PL_unify_list_nchars = Module["_PL_unify_list_nchars"] = function() {
        return (_PL_unify_list_nchars = Module["_PL_unify_list_nchars"] = Module["asm"]["Gd"]).apply(null, arguments)
      };
      var _PL_unify_list_chars = Module["_PL_unify_list_chars"] = function() {
        return (_PL_unify_list_chars = Module["_PL_unify_list_chars"] = Module["asm"]["Hd"]).apply(null, arguments)
      };
      var _PL_unify_pointer = Module["_PL_unify_pointer"] = function() {
        return (_PL_unify_pointer = Module["_PL_unify_pointer"] = Module["asm"]["Id"]).apply(null, arguments)
      };
      var _PL_unify_arg = Module["_PL_unify_arg"] = function() {
        return (_PL_unify_arg = Module["_PL_unify_arg"] = Module["asm"]["Jd"]).apply(null, arguments)
      };
      var _PL_unify_term = Module["_PL_unify_term"] = function() {
        return (_PL_unify_term = Module["_PL_unify_term"] = Module["asm"]["Kd"]).apply(null, arguments)
      };
      var _PL_put_blob = Module["_PL_put_blob"] = function() {
        return (_PL_put_blob = Module["_PL_put_blob"] = Module["asm"]["Ld"]).apply(null, arguments)
      };
      var _PL_term_type = Module["_PL_term_type"] = function() {
        return (_PL_term_type = Module["_PL_term_type"] = Module["asm"]["Md"]).apply(null, arguments)
      };
      var _PL_context = Module["_PL_context"] = function() {
        return (_PL_context = Module["_PL_context"] = Module["asm"]["Nd"]).apply(null, arguments)
      };
      var _PL_module_name = Module["_PL_module_name"] = function() {
        return (_PL_module_name = Module["_PL_module_name"] = Module["asm"]["Od"]).apply(null, arguments)
      };
      var _PL_predicate_info = Module["_PL_predicate_info"] = function() {
        return (_PL_predicate_info = Module["_PL_predicate_info"] = Module["asm"]["Pd"]).apply(null, arguments)
      };
      var _PL_call = Module["_PL_call"] = function() {
        return (_PL_call = Module["_PL_call"] = Module["asm"]["Qd"]).apply(null, arguments)
      };
      var _PL_foreign_context = Module["_PL_foreign_context"] = function() {
        return (_PL_foreign_context = Module["_PL_foreign_context"] = Module["asm"]["Rd"]).apply(null, arguments)
      };
      var _PL_foreign_context_predicate = Module["_PL_foreign_context_predicate"] = function() {
        return (_PL_foreign_context_predicate = Module["_PL_foreign_context_predicate"] = Module["asm"]["Sd"]).apply(null, arguments)
      };
      var _PL_register_extensions_in_module = Module["_PL_register_extensions_in_module"] = function() {
        return (_PL_register_extensions_in_module = Module["_PL_register_extensions_in_module"] = Module["asm"]["Td"]).apply(null, arguments)
      };
      var _PL_register_extensions = Module["_PL_register_extensions"] = function() {
        return (_PL_register_extensions = Module["_PL_register_extensions"] = Module["asm"]["Ud"]).apply(null, arguments)
      };
      var _PL_register_foreign = Module["_PL_register_foreign"] = function() {
        return (_PL_register_foreign = Module["_PL_register_foreign"] = Module["asm"]["Vd"]).apply(null, arguments)
      };
      var _PL_abort_hook = Module["_PL_abort_hook"] = function() {
        return (_PL_abort_hook = Module["_PL_abort_hook"] = Module["asm"]["Wd"]).apply(null, arguments)
      };
      var _PL_abort_unhook = Module["_PL_abort_unhook"] = function() {
        return (_PL_abort_unhook = Module["_PL_abort_unhook"] = Module["asm"]["Xd"]).apply(null, arguments)
      };
      var _PL_dispatch_hook = Module["_PL_dispatch_hook"] = function() {
        return (_PL_dispatch_hook = Module["_PL_dispatch_hook"] = Module["asm"]["Yd"]).apply(null, arguments)
      };
      var _PL_duplicate_record = Module["_PL_duplicate_record"] = function() {
        return (_PL_duplicate_record = Module["_PL_duplicate_record"] = Module["asm"]["Zd"]).apply(null, arguments)
      };
      var _PL_action = Module["_PL_action"] = function() {
        return (_PL_action = Module["_PL_action"] = Module["asm"]["_d"]).apply(null, arguments)
      };
      var _PL_query = Module["_PL_query"] = function() {
        return (_PL_query = Module["_PL_query"] = Module["asm"]["$d"]).apply(null, arguments)
      };
      var _PL_get_file_nameW = Module["_PL_get_file_nameW"] = function() {
        return (_PL_get_file_nameW = Module["_PL_get_file_nameW"] = Module["asm"]["ae"]).apply(null, arguments)
      };
      var ___stdio_exit = Module["___stdio_exit"] = function() {
        return (___stdio_exit = Module["___stdio_exit"] = Module["asm"]["be"]).apply(null, arguments)
      };
      var ___funcs_on_exit = Module["___funcs_on_exit"] = function() {
        return (___funcs_on_exit = Module["___funcs_on_exit"] = Module["asm"]["ce"]).apply(null, arguments)
      };
      var _memalign = Module["_memalign"] = function() {
        return (_memalign = Module["_memalign"] = Module["asm"]["de"]).apply(null, arguments)
      };
      var _setThrew = Module["_setThrew"] = function() {
        return (_setThrew = Module["_setThrew"] = Module["asm"]["ee"]).apply(null, arguments)
      };
      var stackSave = Module["stackSave"] = function() {
        return (stackSave = Module["stackSave"] = Module["asm"]["fe"]).apply(null, arguments)
      };
      var stackRestore = Module["stackRestore"] = function() {
        return (stackRestore = Module["stackRestore"] = Module["asm"]["ge"]).apply(null, arguments)
      };
      var stackAlloc = Module["stackAlloc"] = function() {
        return (stackAlloc = Module["stackAlloc"] = Module["asm"]["he"]).apply(null, arguments)
      };
      var dynCall_iiji = Module["dynCall_iiji"] = function() {
        return (dynCall_iiji = Module["dynCall_iiji"] = Module["asm"]["ie"]).apply(null, arguments)
      };
      var dynCall_iij = Module["dynCall_iij"] = function() {
        return (dynCall_iij = Module["dynCall_iij"] = Module["asm"]["je"]).apply(null, arguments)
      };
      var dynCall_ij = Module["dynCall_ij"] = function() {
        return (dynCall_ij = Module["dynCall_ij"] = Module["asm"]["ke"]).apply(null, arguments)
      };

      function invoke_iii(index, a1, a2) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_vi(index, a1) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_ii(index, a1) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_viii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_vii(index, a1, a2) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_v(index) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)()
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_i(index) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)()
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiiii(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          return getWasmTableEntry(index)(a1, a2, a3, a4)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iiji(index, a1, a2, a3, a4) {
        var sp = stackSave();
        try {
          return dynCall_iiji(index, a1, a2, a3, a4)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_iij(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          return dynCall_iij(index, a1, a2, a3)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }

      function invoke_ij(index, a1, a2) {
        var sp = stackSave();
        try {
          return dynCall_ij(index, a1, a2)
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0 && e !== "longjmp") throw e;
          _setThrew(1, 0)
        }
      }
      Module["intArrayFromString"] = intArrayFromString;
      Module["cwrap"] = cwrap;
      Module["setValue"] = setValue;
      Module["getValue"] = getValue;
      Module["allocate"] = allocate;
      Module["UTF8ToString"] = UTF8ToString;
      Module["stringToUTF8"] = stringToUTF8;
      Module["lengthBytesUTF8"] = lengthBytesUTF8;
      Module["addRunDependency"] = addRunDependency;
      Module["removeRunDependency"] = removeRunDependency;
      Module["FS_createPath"] = FS.createPath;
      Module["FS_createDataFile"] = FS.createDataFile;
      Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
      Module["FS_createLazyFile"] = FS.createLazyFile;
      Module["FS_createDevice"] = FS.createDevice;
      Module["FS_unlink"] = FS.unlink;
      Module["FS"] = FS;
      Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
      var calledRun;

      function ExitStatus(status) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status
      }
      dependenciesFulfilled = function runCaller() {
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller
      };

      function run(args) {
        args = args || arguments_;
        if (runDependencies > 0) {
          return
        }
        preRun();
        if (runDependencies > 0) {
          return
        }

        function doRun() {
          if (calledRun) return;
          calledRun = true;
          Module["calledRun"] = true;
          if (ABORT) return;
          initRuntime();
          readyPromiseResolve(Module);
          console.log("Called Run")
          if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
          postRun()
        }
        if (Module["setStatus"]) {
          Module["setStatus"]("Running...");
          setTimeout(function() {
            setTimeout(function() {
              Module["setStatus"]("")
            }, 1);
            doRun()
          }, 1)
        } else {
          doRun()
        }
      }
      Module["run"] = run;

      function exit(status, implicit) {
        EXITSTATUS = status;
        if (keepRuntimeAlive()) {} else {
          exitRuntime()
        }
        procExit(status)
      }

      function procExit(code) {
        EXITSTATUS = code;
        if (!keepRuntimeAlive()) {
          if (Module["onExit"]) Module["onExit"](code);
          ABORT = true
        }
        quit_(code, new ExitStatus(code))
      }
      if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
          Module["preInit"].pop()()
        }
      }
      run();

      function Prolog(module, args) {
        this.module = module;
        this.args = args;
        this.bindings = {};
        this._bind();
        this._initialise()
      }
      Prolog.prototype._bind = function() {
        this.bindings.PL_atom_chars = this.module.cwrap("PL_atom_chars", "number", ["number"]);
        this.bindings.PL_functor_arity = this.module.cwrap("PL_functor_arity", "number", ["number"]);
        this.bindings.PL_functor_name = this.module.cwrap("PL_functor_name", "number", ["number"]);
        this.bindings.PL_get_functor = this.module.cwrap("PL_get_functor", "number", ["number", "number"]);
        this.bindings.PL_get_chars = this.module.cwrap("PL_get_chars", "number", ["number", "number", "number"]);
        this.bindings.PL_get_arg = this.module.cwrap("PL_get_arg", "number", ["number", "number", "number"]);
        this.bindings.PL_get_integer = this.module.cwrap("PL_get_integer", "number", ["number", "number"]);
        this.bindings.PL_put_chars = this.module.cwrap("PL_put_chars", "number", ["number", "number", "number", "number"]);
        this.bindings.PL_unify = this.module.cwrap("PL_unify", "number", ["number", "number"]);
        this.bindings.PL_is_string = this.module.cwrap("PL_is_string", "number", ["number"]);
        this.bindings.PL_initialise = this.module.cwrap("PL_initialise", "number", ["number", "number"]);
        this.bindings.PL_new_atom = this.module.cwrap("PL_new_atom", "number", ["string"]);
        this.bindings.PL_new_functor = this.module.cwrap("PL_new_functor", "number", ["number", "number"]);
        this.bindings.PL_new_term_ref = this.module.cwrap("PL_new_term_ref", "number", []);
        this.bindings.PL_put_functor = this.module.cwrap("PL_put_functor", "number", ["number", "number"]);
        this.bindings.PL_chars_to_term = this.module.cwrap("PL_chars_to_term", "number", ["string", "number"]);
        this.bindings.PL_call = this.module.cwrap("PL_call", "number", ["number", "number"]);
        this.bindings.PL_unify_arg = this.module.cwrap("PL_unify_arg", "number", ["number", "number", "number"])
      };
      Prolog.prototype._initialise = function() {
        var argv = this.args.map(function(arg) {
          return this.module.allocate(this.module.intArrayFromString(arg), "i8", this.module.ALLOC_NORMAL)
        }, this);
        var ptr = this.module._malloc(argv.length * 4);
        argv.forEach(function(arg, i) {
          this.module.setValue(ptr + i * 4, arg, "*")
        }, this);
        if (!this.bindings.PL_initialise(4, ptr)) {
          throw new Error("SWI-Prolog initialisation failed.")
        }
        this.call_string("assert(user:file_search_path(library, 'wasm-preload/library')).")
      };
      Prolog.prototype.call_string = function(query) {
        var ref = this.new_term_ref();
        if (!this.chars_to_term(query, ref)) {
          throw new Error("Query has a syntax error: " + query)
        }
        return !!this.call(ref, 0)
      };
      Prolog.prototype.functor_arity = function(functor) {
        return this.bindings.PL_functor_arity(functor)
      };
      Prolog.prototype.functor_name = function(functor) {
        return this.bindings.PL_functor_name(functor)
      };
      Prolog.prototype.get_functor = function(term) {
        var ptr = this.module._malloc(4);
        if (this.bindings.PL_get_functor(term, ptr)) {
          var functor = this.module.getValue(ptr, "i32");
          this.module._free(ptr);
          return functor
        } else {
          this.module._free(ptr);
          return null
        }
      };
      Prolog.prototype.get_integer = function(term) {
        var ptr = this.module._malloc(4);
        if (this.bindings.PL_get_integer(term, ptr)) {
          var number = this.module.getValue(ptr, "i32");
          this.module._free(ptr);
          return number
        } else {
          this.module._free(ptr);
          return null
        }
      };
      Prolog.prototype.put_chars_string = function(term, string) {
        var len = this.module.lengthBytesUTF8(string) + 1;
        var ptr = this.module._malloc(len);
        this.module.stringToUTF8(string, ptr, len);
        var ret = !!this.bindings.PL_put_chars(term, 5 | 4096, len - 1, ptr);
        this.module._free(ptr);
        return ret
      };
      Prolog.prototype.unify = function(term1, term2) {
        return !!this.bindings.PL_unify(term1, term2)
      };
      Prolog.prototype.is_string = function(term) {
        return !!this.bindings.PL_is_string(term)
      };
      Prolog.prototype.atom_chars = function(atom) {
        var ptr = this.bindings.PL_atom_chars(atom);
        if (ptr === 0) {
          return null
        } else {
          return this.module.Pointer_stringify(ptr)
        }
      };
      Prolog.prototype.call = function(term, module) {
        return this.bindings.PL_call(term, module)
      };
      Prolog.prototype.chars_to_term = function(query, t) {
        return this.bindings.PL_chars_to_term(query, t)
      };
      Prolog.prototype.get_chars = function(term) {
        var ptr = this.module._malloc(4);
        var flags = 1 | 2 | 4 | 8 | 16 | 32 | 128 | 4096 | 512;
        if (this.bindings.PL_get_chars(term, ptr, flags)) {
          return this.module.UTF8ToString(this.module.getValue(ptr, "i32"))
        } else {
          return null
        }
      };
      Prolog.prototype.get_arg = function(index, term, arg) {
        return this.bindings.PL_get_arg(index, term, arg)
      };
      Prolog.prototype.new_atom = function(string) {
        return this.bindings.PL_new_atom(string)
      };
      Prolog.prototype.new_functor = function(atom, arity) {
        return this.bindings.PL_new_functor(atom, arity)
      };
      Prolog.prototype.new_term_ref = function() {
        return this.bindings.PL_new_term_ref()
      };
      Prolog.prototype.put_functor = function(term, functor) {
        return this.bindings.PL_put_functor(term, functor)
      };
      Prolog.prototype.unify_arg = function(index, term, arg) {
        return this.bindings.PL_unify_arg(index, term, arg)
      };
      Module.onRuntimeInitialized = function() {
        console.log("Called Prolog")
        Module.prolog = new Prolog(Module, Module.arguments)
      };


      return SWIPL.ready
    }
  );
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = SWIPL;
else if (typeof define === 'function' && define['amd'])
  define([], function() {
    return SWIPL;
  });
else if (typeof exports === 'object')
  exports["SWIPL"] = SWIPL;
