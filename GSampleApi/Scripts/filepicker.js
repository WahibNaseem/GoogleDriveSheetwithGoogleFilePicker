/**!
 * Google Drive File Picker Example
 * By Daniel Lo Nigro (http://dan.cx/)
 */
(function () {
	/**
	 * Initialise a Google Driver file picker
	 */
    var FilePicker = window.FilePicker = function (options) {
        // Config
        this.apiKey = options.apiKey;
        this.clientId = options.clientId;

        // Elements
        this.buttonEl = options.buttonEl;

        // Events
        //this.onSelect = options.onSelect;
        this.buttonEl.addEventListener('click', this.open.bind(this));

        // Disable the button until the API loads, as it won't work properly until then.
        this.buttonEl.disabled = true;

        // Load the drive API
        gapi.client.setApiKey(this.apiKey);
        gapi.client.load('drive', 'v2', this._driveApiLoaded.bind(this));
        google.load('picker', '1', { callback: this._pickerApiLoaded.bind(this) });
    }
    var accessToken;



    FilePicker.prototype = {
		/**
		 * Open the file picker.
		 */
        open: function () {
            $.ajax({
                type: "POST",
                url: "/Home/Authrozie/",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.success != null && data.success == true) {
                        accessToken = data.access_token;
                    }
                    else {
                        console.log("Error");
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr.responseText);
                }
            });

            //Check if the user has already authenticated
            if (accessToken) {
                alert(accessToken);
                this._showPicker();
            }

        },

		/**
		 * Show the file picker once authentication has been done.
		 * @private
		 */

        _showPicker: function () {

            //View all the documents of Google drive
            //var DisplayView = new google.picker.View(google.picker.ViewId.DOCS);


            //View all the SpreadSheets of Google drive
            var DisplayView = new google.picker.View(google.picker.ViewId.SPREADSHEETS);


            //View all the documents of a Specific folder of Google drive
            //var DisplayView = new google.picker.DocsView().setParent('PUT YOUR FOLDER ID');


            //View all the documents & folders of google drive
            //var DisplayView = new google.picker.DocsView().setIncludeFolders(true);


            /*
              Only view all Folders in Google drive.
              var DisplayView = new google.picker.DocsView()
              .setIncludeFolders(true)
              .setMimeTypes('application/vnd.google-apps.folder')
             .setSelectFolderEnabled(true);*/

            /* Comment this line by Wahib */
            /*addView(google.picker.ViewId.Docs).*/


            //Use DocsUploadView to upload documents to Google Drive.
            //var UploadView = new google.picker.DocsUploadView();

           /* addViewGroup(new google.picker.ViewGroup(google.picker.ViewId.DOCS).
             addView(google.picker.ViewId.DOCUMENTS).
             addView(google.picker.ViewId.PRESENTATIONS)).*/


            //========Show Different Upload View in Picker Dialog box=======

            //User can upload file in any folder (by select folder)
            var UploadView = new google.picker.DocsUploadView().setIncludeFolders(true);

            //User can upload file in specific folder
            //var UploadView = new google.picker.DocsUploadView().setParent('PUT YOUR FOLDER ID')

            if (accessToken) {
                this.picker = new google.picker.PickerBuilder().
                    addView(DisplayView).
                    setAppId(this.clientId).
                    addView(UploadView).
                    setOAuthToken(accessToken).
                    setCallback(this._pickerCallback.bind(this)).
                    build().
                    setVisible(true);
            }
           
        },

		/**
		 * Called when a file has been selected in the Google Drive file picker.
		 * @private
		 */
        _pickerCallback: function (data) {
            if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {                
                /*gapi.client.drive.files.export({
                    'fileId': data.docs[0].id,
                    'mimeType': 'text/csv'
                }).then(function (success) {
                    console.log(success.body);
                    //success.result    
                }, function (fail) {
                    console.log(fail);
                    console.log('Error ' + fail.result.error.message);
                })*/

                data.docs[0].name
                $.post("/Home/DownloadFile/", { "FileId": data.docs[0].id, "FileName": data.docs[0].name+".xls" },function (response){
                    if (response.success != null && response.success == true) {
                            alert('Successfully');
                        }
                        else {
                            alert("Error: " + data.ErrorMsg);
                        }
                });

                //var datastring = "fileId=" + data.docs[0].id;
                //$.ajax({
                //    type: "POST",
                //    url: "/Home/DownloadFile/",
                //    data: datastring,
                //    dataType: "json",
                //    success: function (data) {
                //        if (data.success != null && data.success == true) {
                //            alert('Successfully');
                //        }
                //        else {
                //            alert("Error: " + data.ErrorMsg);
                //        }
                //    },
                //    error: function (xhr, textStatus, errorThrown) {
                //        console.log(xhr.responseText);
                //    }
                //});



                /*Code for getting the file and the url*/
                //var url = 'nothing';
                //console.log('URL => ' + data[google.picker.Response.DOCUMENTS][0].url)
                var file = data[google.picker.Response.DOCUMENTS][0],
                    id = file[google.picker.Document.ID],
                    url = file[google.picker.Document.URL];
                //request = gapi.client.drive.files.get({
                //    fileId: id
                //});
                console.log("We are having Id " + id);

                var message = 'You picked: ' + url;
                document.getElementById('result').innerHTML = message;


                //Execute this method for onSelect
                //request.execute(this._fileGetCallback.bind(this));
            }
        },
		/**
		 * Called when file details have been retrieved from Google Drive.
		 * @private
		 */
        _fileGetCallback: function (file) {
            if (this.onSelect) {
                this.onSelect(file);
            }
        },

		/**
		 * Called when the Google Drive file picker API has finished loading.
		 * @private
		 */
        _pickerApiLoaded: function () {
            this.buttonEl.disabled = false;
        },

		/**
		 * Called when the Google Drive API has finished loading.
		 * @private
		 */

        _driveApiLoaded: function () {
            this._doAuth();
        },

		/**
		 * Authenticate with Google Drive via the Google JavaScript API.
		 * @private
		 */
        _doAuth: function (immediate, callback) {}
    };
}());