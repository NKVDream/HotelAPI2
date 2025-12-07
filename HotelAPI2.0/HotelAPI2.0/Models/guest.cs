using System.ComponentModel.DataAnnotations.Schema;

namespace HotelAPI2._0.Models
{
    [Table("guest")]
    public class Guest
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("surname")]
        public string Surname { get; set; } = string.Empty;

        [Column("phone")]
        public string Phone { get; set; } = string.Empty;
    }
}