using GSampleApi.Models;
using GSampleApi.Plugin;
using System.Web.Mvc;

namespace GSampleApi.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Authrozie()
        {
            var authModel = GoogleDriveSheets.Authorize();
            if (authModel == null)
            {
                return Json(new
                {

                    success = false,
                    Error = "Couldn't Authorize"

                });
            }

            return Json(new
            {
                access_token = authModel.AccessToken,
                success = true
            });
        }

        public ActionResult DownloadFile(GoogleDriveFile googleDriveFile)
        {
            if (GoogleDriveSheets.GoogleSheetDownLoad(GoogleDriveSheets.Authorize().DriveService, googleDriveFile)) { 
                return Json(new
                {
                    success = true
                });
            }
            else
            {
                return Json(new
                {
                    success = false
                });
            }
        }



    }
}