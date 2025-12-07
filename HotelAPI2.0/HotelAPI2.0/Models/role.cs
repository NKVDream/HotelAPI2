using System.ComponentModel.DataAnnotations.Schema;

namespace HotelAPI2._0.Models
{
    [Table("role")]
    public class Role
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("role_name")]
        public string RoleName { get; set; } = string.Empty;

        [Column("description")]
        public string Description { get; set; } = string.Empty;
    }
}
