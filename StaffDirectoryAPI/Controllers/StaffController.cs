using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace StaffDirectory.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StaffController : ControllerBase
    {
       
        private readonly ILogger<StaffController> _logger;

        public StaffController(ILogger<StaffController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> UploadStaffList(IFormFile formFile)
        {
            _logger.LogInformation($"START UploadStaffList " + formFile?.FileName);

            var staffList = new List<Staff>();

            try 
            { 
                staffList = await MapFileToStaffList(formFile);
            }
            catch(Exception e)
            {
                _logger.LogError($"UploadStaffList " + e);
                return BadRequest();
            }

            _logger.LogInformation($"END UploadStaffList " + formFile?.FileName);
            return Ok(staffList);
        }

        private static async Task<List<Staff>> MapFileToStaffList(IFormFile formFile)
        {
            var stafflist = new List<Staff>();

            using (var ms = new MemoryStream())
            {
                await formFile.CopyToAsync(ms);

                using var package = new ExcelPackage(ms);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                var currentSheet = package.Workbook.Worksheets;
                var workSheet = currentSheet.First();
                var noOfCol = workSheet.Dimension.End.Column;
                var noOfRow = workSheet.Dimension.End.Row;
                for (int rowIterator = 2; rowIterator <= noOfRow; rowIterator++)
                {
                    var staff = new Staff
                    {
                        EmployeeNumber = Convert.ToInt32(workSheet.Cells[rowIterator, 1].Value),
                        FirstName = workSheet.Cells[rowIterator, 2].Value.ToString(),
                        LastName = workSheet.Cells[rowIterator, 3].Value.ToString(),
                        EmployeeStatus = workSheet.Cells[rowIterator, 4].Value.ToString(),
                    };
                    stafflist.Add(staff);
                }
            }

            return stafflist;
        }
    }

}