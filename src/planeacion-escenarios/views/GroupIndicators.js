const GroupIndicators = () => {
    return (
        <div className="content">
            <h2 className="section_title">INDICADORES POR GRUPOS</h2>
            <div className="content-row" style={{gap:0}}>
                <div style={{display:'flex', flex:1, backgroundImage:'url(/pxe_images/GroupedZones.png)', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}/>
                <div style={{display:'flex', flex:'0 0 50%' }}>
                    <img src='/pxe_images/IndicadoresGrupos.png' style={{ width: '100%', height:'auto', objectFit:'contain', display:'block'}}/>
                </div>
            </div>
        </div>
    )
}

export default GroupIndicators;