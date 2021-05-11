namespace Domain
{
    public class UserFollowing
    {
        public string FollowerId { get; set; }
        public AppUser Follower { get; set; }
        public string TargetId { get; set; }
        public AppUser Target { get; set; }
    }
}