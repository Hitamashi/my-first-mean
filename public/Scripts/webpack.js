var jqueruui = require("./Vendor/jquery-ui.min.js");
var bootstrap = require("./Vendor/bootstrap.min.js");
var dashboard = require("./Vendor/dashboard.js")

var select = require("./Vendor/select.min.js");
var uibootstrap = require("./Vendor/ui-bootstrap-tpls-0.14.3.min.js");
var ngAnimate = require("./Vendor/angular-animate.js");
var ngSanitize = require("./Vendor/angular-sanitize.js");
var ngCookies = require("./Vendor/angular-cookies.min.js")
var ngRoutes = require("./Vendor/angular-route.js")
var bootstrapNotify = require("./Vendor/bootstrap-notify.min.js");
var bootstrapNotifyCustom = require("./Vendor/bootstrap-notify-custom.js");
var ngFileUpload = require("./Vendor/ng-file-upload-all.min.js")
var formatAsCurrency = require("./Vendor/format-as-currency.js")

//MAIN APP
var app = require("./main.js");

var appAuthorization = require("./authorization.js");
var appRoutes = require("./appRoutes.js");

//SERVICE
var servData = require("./Services/data-service.js");
var servAuth = require("./Services/auth-service.js");

//CONTROLLER
var MainCtrl = require("./Controllers/controller.js");
var DashboardCtrl = require("./Controllers/DashboardCtrl.js");
var HistoryCtrl = require("./Controllers/HistoryCtrl.js");
var UserCtrl = require("./Controllers/UserCtrl.js");
var TicketCtrl = require("./Controllers/TicketCtrl.js");

//Directives
var dirPagination = require("./Directives/dirPagination.js");
var detailComment = require("./Directives/detailComments.js");

//Form
var requestForm = require("./Directives/Form/requestForm.js");
var programForm = require("./Directives/Form/programForm.js");
var infoForm = require("./Directives/Form/infoForm.js");
var followForm = require("./Directives/Form/followForm.js");
var estimationForm = require("./Directives/Form/estimationForm.js");
var contractAdminForm = require("./Directives/Form/contractAdminForm.js");
var contractAccForm = require("./Directives/Form/contractAccForm.js");
