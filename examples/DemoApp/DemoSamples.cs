using DemoApp.Controllers.Base;

namespace DemoApp;

/// <summary>
/// The sample lists more than one page draws, written once so the pages cannot drift apart.
/// </summary>
internal static class DemoSamples
{
    /// <summary>The three deploy targets, each with a glyph, a second line and a badge.</summary>
    public static OptionItem[] Environments()
        => [
            new()
            {
                Id = "prod",
                Icon = DemoIcons.Shield,
                Title = "Production",
                Description = "eu-west · 12 replicas",
                BadgeTitle = "Locked",
                BadgeVariant = UIBadgeVariant.Danger
            },
            new()
            {
                Id = "staging",
                Icon = DemoIcons.BadgeCheck,
                Title = "Staging",
                Description = "eu-west · 3 replicas",
                BadgeTitle = "Open",
                BadgeVariant = UIBadgeVariant.Success
            },
            new()
            {
                Id = "dev",
                Icon = DemoIcons.Settings,
                Title = "Development",
                Description = "eu-central · 1 replica",
                BadgeTitle = "Rebuilt daily",
                BadgeVariant = UIBadgeVariant.Info
            }
        ];

    /// <summary>The services the items pages list, bucketed by region.</summary>
    public static DemoServiceItem[] Services()
        =>
        [
            Service("billing", "Billing", "12 replicas · eu-west", "Europe West", "Healthy", UIBadgeVariant.Success, DemoIcons.Shield),
            Service("panel", "Panel", "4 replicas · eu-west", "Europe West", "Healthy", UIBadgeVariant.Success, DemoIcons.LayoutDashboard),
            Service("dns", "DNS", "2 replicas · eu-west", "Europe West", "Degraded", UIBadgeVariant.Warning, DemoIcons.Link),
            Service("mail-relay", "Mail Relay", "1 replica · us-east", "US East", "Paused", UIBadgeVariant.Surface, DemoIcons.Mail),
            Service("metrics", "Metrics", "3 replicas · us-east", "US East", "Healthy", UIBadgeVariant.Success, DemoIcons.FileText),
            Service("status-page", "Status Page", "2 replicas · us-east", "US East", "Healthy", UIBadgeVariant.Success, DemoIcons.Bell),
            Service("scheduler", "Scheduler", "1 replica · ap-south", "Asia South", "Healthy", UIBadgeVariant.Success, DemoIcons.Clock),
            Service("audit-log", "Audit Log", "2 replicas · ap-south", "Asia South", "Healthy", UIBadgeVariant.Success, DemoIcons.History)
        ];

    /// <summary>One service row; its region is kept apart from its group, so a cleared group can be put back.</summary>
    public static DemoServiceItem Service(string id, string title, string description, string region, string badge, UIBadgeVariant badgeVariant, string icon)
        => new() { Id = id, Icon = icon, Title = title, Description = description, BadgeTitle = badge, BadgeVariant = badgeVariant, Group = region, Region = region };
}
