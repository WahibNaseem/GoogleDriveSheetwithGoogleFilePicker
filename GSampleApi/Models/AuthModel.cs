using Google.Apis.Drive.v3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GSampleApi.Models
{
    public class AuthModel
    {
        public string AccessToken { get; set; }
        public DriveService DriveService { get; set; }
    }
}