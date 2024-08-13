import './styles.css'
import ah from '../../../public/ah.png'

function Footer() {
    return (
        <section className="footer">
            <p>Designed and developed by <a href="https://ashleycreates.org/" target="_blank">ashleycreates.org</a> <img src={ah}/></p>
        </section>
    )
}

export default Footer;