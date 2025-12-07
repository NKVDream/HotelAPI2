using System.ComponentModel.DataAnnotations.Schema;

namespace HotelAPI2._0.Models
{
    [Table("room")]
    public class Room
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("room_capacity")]
        public int RoomCapacity { get; set; }

        [Column("room_level")]
        public int RoomLevel { get; set; }

        [Column("price")]
        public int Price { get; set; }

        [Column("availability")]
        public bool Availability { get; set; } = true;

        [Column("floor")]
        public int Floor { get; set; }

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("responsible_employee")]
        public int ResponsibleEmployee { get; set; }
    }
}
