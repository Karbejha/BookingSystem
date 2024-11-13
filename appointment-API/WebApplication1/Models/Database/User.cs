using System;
using System.Collections.Generic;

namespace WebApplication1.Models.Database;

public partial class User
{
    public int Id { get; set; }

    public string? FullName { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public sbyte? IsActive { get; set; }

    public int Type { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }
}
