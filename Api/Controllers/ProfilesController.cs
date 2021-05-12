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
        public async Task<IActionResult> EditProfile(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetProfileActivities(string userName, [FromQuery] string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query
                {UserName = userName, Predicate = predicate}));
        }
    }
}