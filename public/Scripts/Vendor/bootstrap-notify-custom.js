$.notifyDefaults({
	delay: 3000,
	template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-dismissible">' +
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
                '<h4><span data-notify="icon"></span><span data-notify="title">{1}</span></h4>'+
                '<span data-notify="message">{2}</span>' +
              '</div>'
});