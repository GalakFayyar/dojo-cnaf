using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CAFfrMAPBack.Models
{
    public class POI
    {
        public string Nom { get; set; }
        public string AdresseComplete
        {
            get
            {
                return string.Format("{0} {1} {2}", this.Adresse, this.CodePostal, this.Ville);
            }
        }
        public string Adresse { get; set; }
        public int CodePostal { get; set; }
        public string Ville { get; set; }
        public string Type { get; set; }
    }
}