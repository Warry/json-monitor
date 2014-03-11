$(function(){

	// Elements
	var form = $("form")
	  , method = $("select",form)
	  , entity = $("input[type=text]",form)
	  , datas = $("textarea",form)
	  , result = $("section pre")

	// Observables
	var history = ko.observableArray()
	  , selectedMethod = ko.observable()
	  , showData = ko.computed(function() {
	  	return selectedMethod() == "POST" || selectedMethod() == "PUT"
	  })

	// Local Storage
	var historyManager = (function(){

		if(!window.localStorage['history']) window.localStorage['history'] ='[{"method":"GET","type":"application/x-www-form-urlencoded","url":"https://api.github.com/legacy/repos/search/playframework","data":"//This is an example, hit AJAX button to see the result","status":200}]'

		history(JSON.parse(window.localStorage['history']))

		history.subscribe(function(){
			window.localStorage['history'] = JSON.stringify(history.slice(0,300))
		})

	})();

	// Make ajax call
	function req(o) {
		console.log(o)
		$.ajax({
			url: o.url
		  , type: o.method
		  , contentType: o.type
		  , data: o.data
		  , dataType: "json"
		  , success: function(e, i, j){
				result.text(JSON.stringify(e, null, "    "))
			}
		  , error: function(e){
				result.text(e.responseText.toString())
			}
		  , complete: function(e){
				o.status = e.status
				history.unshift(o)
			}
		})
	}

	// Bind form
	form.on("submit", function(e){
		e.preventDefault()
		var m = method.val()
		console.log(datas.val())
		req({
				method: m
		  , data: (m=="POST"||m=="PUT")?datas.val():''
		  , type: (m=="POST"||m=="PUT")?"application/json":"application/x-www-form-urlencoded"
		  , url: entity.val()
		})
	})

	datas.keydown(function(e) {
		if(e.keyCode === 9 && !e.shiftKey) {
			var start = this.selectionStart
			var end = this.selectionEnd
			var $this = $(this)
			var value = $this.val()
			$this.val(value.substring(0, start)
						+ "\t"
						+ value.substring(end))
			this.selectionStart = this.selectionEnd = start + 1
			e.preventDefault()
		}
	})

	// Click on history item
	function fillFromHistory(o){
		datas.text(o.data?o.data:"")
		method.val(o.method)
		entity.val(o.url).focus()
	}

	// Click on delete item
	function removeFromHistory(o){
		console.log("???????????")
		history.remove(o)
	}

	// Let's go
	ko.applyBindings({
		history: 						history
	, fillFromHistory: 		fillFromHistory
	, removeFromHistory: 	removeFromHistory
	, selectedMethod: 		selectedMethod
	, showData:         	showData
	}, document.body)

})




