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
                BadgeText = "Locked",
                BadgeStyle = UIBadgeType.Danger
            },
            new()
            {
                Id = "staging",
                Icon = DemoIcons.BadgeCheck,
                Title = "Staging",
                Description = "eu-west · 3 replicas",
                BadgeText = "Open",
                BadgeStyle = UIBadgeType.Success
            },
            new()
            {
                Id = "dev",
                Icon = DemoIcons.Settings,
                Title = "Development",
                Description = "eu-central · 1 replica",
                BadgeText = "Rebuilt daily",
                BadgeStyle = UIBadgeType.Info
            }
        ];

    /// <summary>The services the items pages list, bucketed by region unless <paramref name="grouped"/> is off.</summary>
    public static DemoServiceItem[] Services(bool grouped = true)
        =>
        [
            Service("billing", "Billing", "12 replicas · eu-west", "Europe West", "Healthy", UIBadgeType.Success, DemoIcons.Shield, grouped),
            Service("panel", "Panel", "4 replicas · eu-west", "Europe West", "Healthy", UIBadgeType.Success, DemoIcons.LayoutDashboard, grouped),
            Service("dns", "DNS", "2 replicas · eu-west", "Europe West", "Degraded", UIBadgeType.Warning, DemoIcons.Link, grouped),
            Service("mail-relay", "Mail Relay", "1 replica · us-east", "US East", "Paused", UIBadgeType.Surface, DemoIcons.Mail, grouped),
            Service("metrics", "Metrics", "3 replicas · us-east", "US East", "Healthy", UIBadgeType.Success, DemoIcons.FileText, grouped),
            Service("status-page", "Status Page", "2 replicas · us-east", "US East", "Healthy", UIBadgeType.Success, DemoIcons.Bell, grouped),
            Service("scheduler", "Scheduler", "1 replica · ap-south", "Asia South", "Healthy", UIBadgeType.Success, DemoIcons.Clock, grouped),
            Service("audit-log", "Audit Log", "2 replicas · ap-south", "Asia South", "Healthy", UIBadgeType.Success, DemoIcons.History, grouped)
        ];

    /// <summary>One service row; its region is kept apart from its group, so a cleared group can be put back.</summary>
    public static DemoServiceItem Service(string id, string title, string description, string region, string badge, UIBadgeType badgeStyle, string icon, bool grouped = true)
        => new() { Id = id, Icon = icon, Title = title, Description = description, BadgeText = badge, BadgeStyle = badgeStyle, Group = grouped ? region : null, Region = region };
}
