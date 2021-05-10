using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetProfile(string userName)
        {
            return HandleResult(await Mediator.Send(new Details.Query {UserName = userName}));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile(Profile profile)
        {
            return HandleResult(await Mediator.Send(new Edit.Command() {Profile = profile}));
        }
    }
}