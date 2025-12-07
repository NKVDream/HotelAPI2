using System.ComponentModel.DataAnnotations.Schema;

namespace HotelAPI2._0.Models
{
    [Table("level")]
    public class Level
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("level_name")]
        public string LevelName { get; set; } = string.Empty;

        [Column("description")]
        public string Description { get; set; } = string.Empty;
    }
}
