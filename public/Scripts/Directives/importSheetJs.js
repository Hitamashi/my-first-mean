app.directive("importSheetJs", function () {
    return {
        scope: { opts: '=' },
        link: function ($scope, $elm, $attrs) {
            $elm.on('change', function (changeEvent) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $scope.$apply(function () {
                        $scope.opts.loading = true;
                        $scope.opts.done = false;
                    });

                    /* read workbook */
                    var bstr = e.target.result;
                    var wb = XLSX.read(bstr, { type: 'binary' });

                    /* grab first sheet */
                    var wsname = wb.SheetNames[0];
                    var ws = wb.Sheets[wsname];

                    /* grab first row and generate column headers */
                    var aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

                    /* update scope */
                    $scope.$apply(function () {
                        $scope.opts.data = angular.copy(aoa);
                        $scope.opts.dataPreview = aoa.splice(1,5);
                        $scope.opts.loading = false;
                        $scope.opts.done = true;
                        console.log($scope.opts.data);
                        console.log($scope.opts.dataPreview);
                    });
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    };
});