import { Modal, Table, Spinner } from "react-bootstrap";

function MedalTimelineModal({ show, onHide, title, data, loading }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-muted">No records found.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Year</th>
                <th>Sport</th>
                <th>Event</th>
                <th>Person / Country</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.year}</td>
                  <td>{row.sport}</td>
                  <td>{row.event}</td>
                  <td>{row.athlete || row.country}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default MedalTimelineModal;
