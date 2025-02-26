import { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Card } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { fetchNeos } from '../services/neoService';
import { NeoObject } from '../types/neo';
import SkyMap from '../components/SkyMap';
import { useWindowSize } from '../hooks/useWindowSize';

// Import dynamique de la carte pour éviter les erreurs SSR
const NeoMap = dynamic(() => import('../components/NeoMap'), { ssr: false });

export default function Home() {
  const [neos, setNeos] = useState<NeoObject[]>([]);
  const { width } = useWindowSize();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchNeos(today, today).then((data) => {
      const neosArray = Object.values(data.near_earth_objects).flat();
      setNeos(neosArray);
    });
  }, []);

  return (
    <Container fluid className="py-3 px-2 px-sm-3 px-md-4">
      <h1 className="mb-4 text-center text-md-start">Objets Proches de la Terre</h1>
      <Row className="g-3">
        <Col xs={12} lg={8}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="map-container" style={{ minHeight: '400px', height: '100%' }}>
                <NeoMap neos={neos} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-2">Nom</th>
                      <th className="px-2">Distance (km)</th>
                      <th className="px-2">Dangereux</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neos.map((neo) => (
                      <tr key={neo.id}>
                        <td className="px-2 text-truncate" style={{ maxWidth: '150px' }}>
                          {neo.name}
                        </td>
                        <td className="px-2">
                          {(parseFloat(neo.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(2)}M
                        </td>
                        <td className="px-2 text-center">
                          {neo.is_potentially_hazardous_asteroid ? '⚠️' : '✓'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body className="p-2 p-sm-3">
              <div className="d-flex justify-content-center">
                <SkyMap 
                  neos={neos} 
                  width={Math.min((width || 800) - 40, 800)} 
                  height={Math.min((width || 800) - 40, 800)} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
