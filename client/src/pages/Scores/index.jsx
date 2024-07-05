import Table from 'react-bootstrap/Table';
import './styles.css';

function Scores() {
    return (
        <section className="scores-page">
            <div className="high-score-container">
                <h1>High Score</h1>
                <p></p>
            </div>
            <Table striped bordered hover style={{marginTop: "10%"}}>
                <thead>
                    <tr>
                        <th><p>Wins</p></th>
                        <th><p>Losses</p></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </section>
    )
}

export default Scores;