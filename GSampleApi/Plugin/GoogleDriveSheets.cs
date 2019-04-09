using Google.Apis.Auth.OAuth2;
using Google.Apis.Download;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Util.Store;
using GSampleApi.Models;
using System;
using System.IO;
using System.Threading;

namespace GSampleApi.Plugin
{

    public class GoogleDriveSheets
    {
        static readonly string[] Scopes = { SheetsService.Scope.DriveReadonly };
        static string ApplicationName = "Google Sheets API Quickstart";
        //private readonly static string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Downloads");
        private readonly static string filePath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);



        public static AuthModel Authorize()
        {
            UserCredential credential;

            /*Get the Creditional File from the solution*/
            var credFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "credentials.json");
            using (var stream = new FileStream(credFilePath, FileMode.Open, FileAccess.Read))
            {
                string credPath = Path.Combine(filePath,"token.json");
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(clientSecrets: GoogleClientSecrets.Load(stream).Secrets,
                    scopes: Scopes,
                    user: "user",
                    taskCancellationToken: CancellationToken.None,
                   dataStore: new FileDataStore(credPath, true)).Result;
            }

            if (credential == null)
                return new AuthModel();

            /*Create the Service for google sheet api */
            //Need to Modifyt this class
            var authModel = new AuthModel()
            {
                AccessToken = credential.Token.AccessToken,
                DriveService = new DriveService(new BaseClientService.Initializer() { HttpClientInitializer = credential, ApplicationName = ApplicationName })
            };
            return authModel;
        }
        public static bool GoogleSheetDownLoad(DriveService driveService, GoogleDriveFile googleDriveFile)
        {
            /*File Downloading format is excel & It could be application/pdf*/
            var request = driveService.Files.Export(fileId: googleDriveFile.FileId, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            var mStream = new MemoryStream();
            bool status = false;

            request.MediaDownloader.ProgressChanged += (IDownloadProgress progress) =>
             {
                 switch (progress.Status)
                 {
                     case DownloadStatus.Completed:
                         //Convert Memory Stream into Byte Array by ToArray Function and the write the all bytes into the File


                         //byte[] downloadImage = mStream.ToArray();
                         //File.WriteAllBytes(string.Format("{0}/{1}", filePath, googleDriveFile.FileName), downloadImage);

                         byte[] downloadImage = mStream.ToArray();
                         File.WriteAllBytes(Path.Combine(filePath, googleDriveFile.FileName), downloadImage);


                         //using (FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                         //{
                         //    mStream.WriteTo(file);
                         //}
                         status = true;
                         break;
                     case DownloadStatus.Failed:
                         status = false;
                         break;

                 }
             };

            request.Download(mStream);
            return status;
        }

    }
}