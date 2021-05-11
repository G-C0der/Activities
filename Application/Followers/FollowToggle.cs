using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var follower = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUserName());

                var target = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == request.TargetUserName);

                if (target is null) return null;

                var following = await _context.UserFollowings.FindAsync(follower.Id, target.Id);

                if (following is null)
                {
                    following = new UserFollowing
                    {
                        Follower = follower,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);
                }
                else
                {
                    _context.UserFollowings.Remove(following);
                }

                bool success = await _context.SaveChangesAsync() > 0;

                return success 
                    ? Result<Unit>.Success(Unit.Value) 
                    : Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}