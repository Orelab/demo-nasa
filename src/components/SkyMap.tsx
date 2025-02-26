import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NeoObject } from '../types/neo';

interface SkyMapProps {
  neos: NeoObject[];
  width: number;
  height: number;
}

const SkyMap = ({ neos, width, height }: SkyMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Configuration de la projection stéréographique
    const projection = d3.geoStereographic()
      .scale(height / 3)
      .center([0, 90])
      .translate([width / 2, height / 2]);

    // Création du conteneur SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Dessiner le fond (cercle représentant le ciel)
    svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", height / 3)
      .attr("fill", "#001133");

    // Ajouter les objets NEO
    neos.forEach(neo => {
      // Utiliser l'ID pour générer une position stable
      const hash = neo.id.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      const ra = (hash % 360); // Ascension droite
      const dec = ((hash * 137) % 180) - 90; // Déclinaison
      const coords = projection([ra, dec]);

      if (coords) {
        svg.append("circle")
          .attr("cx", coords[0])
          .attr("cy", coords[1])
          .attr("r", Math.max(2, neo.estimated_diameter.kilometers.estimated_diameter_max * 2))
          .attr("fill", neo.is_potentially_hazardous_asteroid ? "red" : "white")
          .attr("opacity", 0.8)
          .append("title")
          .text(`${neo.name}\nDistance: ${(parseFloat(neo.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)} million km`);
      }
    });
  }, [neos, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default SkyMap;