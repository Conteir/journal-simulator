import React from "react";
import {
  CollapsibleComponent,
  CollapsibleHead,
  CollapsibleContent,
} from "react-collapsible-component";

export const HTMLRender = class HTMLRender extends React.Component {
  render() {
    return (
      <div>
        <div>{this.renderJson()}</div>
      </div>
    );
  }

  renderItemMetadata(item) {
    return (
      <table>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold" }}>Id</td>
            <td>{item.id ? item.id : null}</td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold" }}>Eier</td>
            <td>{item.eier ? item.eier : null}</td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold" }}>Sist Oppdatert</td>
            <td>{item.sistOppdatert ? item.sistOppdatert : null}</td>
          </tr>

          {item.forstPublisert ? (
            <tr>
              <td>Forst Publisert</td>
              <td>{item.forstPublisert}</td>
            </tr>
          ) : null}

          {item.gruppeId ? (
            <tr>
              <td>Gruppe Id</td>
              <td>{item.gruppeId}</td>
            </tr>
          ) : null}

          {item?.koder?.["ICPC-2"] ? (
            <tr>
              <td>ICPC-2</td>
              <td>{item?.koder["ICPC-2"]}</td>
            </tr>
          ) : null}

          {item?.koder?.["ICD-10"] ? (
            <tr>
              <td>ICD-10</td>
              <td>{item?.koder["ICD-10"]}</td>
            </tr>
          ) : null}

          {item?.koder?.["lis-spesialitet"] ? (
            <tr>
              <td>lis-spesialitet</td>
              <td>{item?.koder["lis-spesialitet"]}</td>
            </tr>
          ) : null}

          {item?.koder?.["lis-laeringsmaal"] ? (
            <tr>
              <td>lis-laeringsmaal</td>
              <td>{item?.koder["lis-laeringsmaal"]}</td>
            </tr>
          ) : null}

          {item?.koder?.["SNOMED-CT"] ? (
            <tr>
              <td>SNOMED-CT</td>
              <td>{item?.koder["SNOMED-CT"]}</td>
            </tr>
          ) : null}

          <tr>
            <td style={{ fontWeight: "bold" }} colSpan="2">
              Tekniske data
            </td>
            <td>{item.tekniskeData ? "" : "none"}</td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold" }}>Info Id</td>
            <td>
              {item.tekniskeData && item.tekniskeData.infoId
                ? item.tekniskeData.infoId
                : ""}
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold" }}>Info type</td>
            <td>
              {item.tekniskeData && item.tekniskeData.infoType
                ? item.tekniskeData.infoType
                : ""}
            </td>
          </tr>

          {item.tekniskeData && item.tekniskeData.subType ? (
            <tr>
              <td>Subtype</td>
              <td>{item.tekniskeData.subType}</td>
            </tr>
          ) : null}

          {item.tekniskeData && item.tekniskeData.HapiId ? (
            <tr>
              <td>HAPI id</td>
              <td>{item.tekniskeData.HapiId}</td>
            </tr>
          ) : null}

          {/*
                  {
                    Array.isArray(item.tema) ?
                      <tr>
                        <td colSpan="2">{this.renderTema(item.tema)}</td>
                      </tr>
                      : null
                  }
                */}

          {
            //rendering links for metadata
            Array.isArray(item.links) ? (
              <tr>
                <td colSpan="2">{this.renderLinks(item.links)}</td>
              </tr>
            ) : null
          }

          {item.attachments ? (
            <tr>
              <td>Attachments</td>
              <td>{item.attachments}</td>
            </tr>
          ) : null}

          <tr>
            <td style={{ fontWeight: "bold" }}>Dokument type</td>
            <td>{item.dokumentType ? item.dokumentType : ""}</td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold" }}>Sist importert til Hapi</td>
            <td>
              {item.sistImportertTilHapi ? item.sistImportertTilHapi : ""}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderTitle = (item) => {
    let rootLink = undefined;

    if (Array.isArray(item.links)) {
      /*
        item.links.forEach(link => {
          if (link.rel==='root') {
            rootLink = link;
          }
        });
      */

      rootLink = item.links.find((link) => link.rel === "root");
    }
    return (
      <h2 className="product-context">
        Hentet fra: {rootLink ? rootLink.$title : ""}
      </h2>
    );
  };

  renderItem(item) {
    return (
      <CollapsibleComponent name={item.id}>
        {" "}
        {/** remember id - should be only 1! */}
        <CollapsibleHead>
          {/** render rooto title */}
          {this.renderTitle(item)}

          <h1>{item.tittel}</h1>
        </CollapsibleHead>
        <CollapsibleContent>
          {/* zacheeeem name=? 
            <div name={item.id}>
              <h2>
                {item.kortTittel !== item.tittel ? item.kortTittel : null}
              </h2>
            </div>
            */}
          <div name={item.id}>{item.intro ? item.intro : ""}</div>
          {/*<div name={item.id}>
              {item.forstPublisert ? item.forstPublisert.substring(0, 11) : ""}
            </div>*/}
          <div dangerouslySetInnerHTML={{ __html: item.tekst }}></div>


          {/* behandlinger handler */}
          {item?.data?.behandlinger ? (
            <CollapsibleHead>
              <h2>Behandlinger</h2>
            </CollapsibleHead>
          ) : null}
          {item?.data?.behandlinger ? (
            <CollapsibleContent>
                {this.renderItemBehandlinger(item.data.behandlinger)}

                {/* commented praktisk */}
                {
                  item?.data?.praktisk ?
                    <div>
                      <b><h1>Praktisk</h1></b>
                      <div dangerouslySetInnerHTML={{ __html: item.data.praktisk.replace(/\\t/g, "")}} ></div>
                    </div> 
                  : null
                }

                {/* begrunnelse */}
                {
                  item.data.rasjonale ? 
                    <div>
                      <b><h1>Begrunnelse – dette er anbefalingen basert på</h1></b>
                      <div dangerouslySetInnerHTML={{ __html: item?.data.rasjonale.replace(/\\t/g, "")}} ></div>
                      
                      { (
                        item?.data.nokkelInfo?.fordelerogulemper && 
                        item?.data.nokkelInfo?.kvalitetdokumentasjon &&
                        item?.data.nokkelInfo?.verdierogpreferanser &&
                        item?.data.nokkelInfo?.ressurshensyn
                        )
                      ?
                        <div>
                          <div className="form-group"><b><h4>Vurdering</h4></b></div>

                          <b>Fordeler og ulemper</b>
                          <div dangerouslySetInnerHTML={{ __html: item?.data.nokkelInfo?.fordelerogulemper}} ></div>

                          <b>Kvalitet på dokumentasjonen</b>
                          <div dangerouslySetInnerHTML={{ __html: item?.data.nokkelInfo?.kvalitetdokumentasjon}} ></div>

                          <b>Verdier og preferanser</b>
                          <div dangerouslySetInnerHTML={{ __html: item?.data.nokkelInfo?.verdierogpreferanser}} ></div>

                          <b>Ressurshensyn</b>
                          <div dangerouslySetInnerHTML={{ __html: item?.data.nokkelInfo?.ressurshensyn}} ></div>

                        </div>

                       : null
                      }

                    </div> 
                  : null
                }

                
            </CollapsibleContent>
          ) : null}


          {item?.data?.rasjonale ? (
            <CollapsibleHead>
              <h2>Rasjonale</h2>
            </CollapsibleHead>
          ) : null}
          {item?.data?.rasjonale ? (
            <CollapsibleContent>
              <div
                dangerouslySetInnerHTML={{ __html: item.data.rasjonale }}
              ></div>
            </CollapsibleContent>
          ) : null}

          {/**creating props to pass it to child component */}
          {
            !this.props.hideMetadata ? (
              <div>
                <CollapsibleHead>
                  <h2>Metadata</h2>
                </CollapsibleHead>
                <CollapsibleContent>
                  {this.renderItemMetadata(item)}{" "}
                </CollapsibleContent>
              </div>
            ) 
            : null
          }

          {/**creating props to pass it to child component */}
          {!this.props.hideLinksNavigation ? (
            <div>
              <CollapsibleHead>
                <h2>Links navigation</h2>
              </CollapsibleHead>
              <CollapsibleContent>
                <ol>
                  {/* rendering links list for navigation block */}
                  {this.renderLinksList(item.links)}
                </ol>
              </CollapsibleContent>
            </div>
          ) : null}
        </CollapsibleContent>
      </CollapsibleComponent> // wrapped the content
    );
  }

  renderDoseRegimerHeads(doseringregimer) {
    return doseringregimer.map((doseregime, dosregindex) => {
      return (
        <div key={dosregindex}>
            
          {/* the whole name of dosering regime with dose and administrasjon vei and ladningdose */}
          <div className="form-group"> 

            {
              doseregime?.data?.legemiddeldoseringsregime.koder ?
                doseregime?.data?.legemiddeldoseringsregime.koder.map((legemiddeldoseringsregime, legemindex) => {
                  return (
                    <div key={legemindex}>

                      {/* if landing dose: */}
                      { 
                        (doseregime?.data?.dosering?.eventuellLadningsdose &&
                          doseregime?.data?.dosering?.styrkeEnhetEventuellLadningsdose?.display &&
                            doseregime?.data?.frekvensEventuellladningsdosePerDogn &&
                            doseregime.data.varighetEventuellLadningsdoseAntallDogn) ? 
                            <div> 
                              {
                                doseregime?.data?.dosering?.eventuellLadningsdose ? 
                                  (doseregime.data.legemiddeldoseringsregime?.koder.map((item, index) => {
                                    return (
                                      <div key={index}>
                                          {
                                            item.display
                                            + " " 
                                            + doseregime.data.dosering.eventuellLadningsdose 
                                            + " " 
                                            + doseregime.data.dosering.styrkeEnhetEventuellLadningsdose.display 
                                            + " x " 
                                            + doseregime.data.frekvensEventuellladningsdosePerDogn
                                            + " i "
                                            + doseregime.data.varighetEventuellLadningsdoseAntallDogn
                                            + " " 
                                            + "døgn"
                                            + " "
                                            + "ladningsdose etterfulgt av"
                                          }
                                      </div>
                                      );
                                    }))
                                : null
                              }
                            </div>
                        : null
                      }

                      {/* substance and form */}
                      {legemiddeldoseringsregime?.display ? legemiddeldoseringsregime?.display : null}
                      {" "}

                      {/* if administrasjon vei: */}
                      {
                        doseregime?.data?.administrasjonsvei ? doseregime?.data?.administrasjonsvei?.koder.map((item, index) => {
                          return (
                            <span key={index}>
                              {item?.display ? item.display : null}
                            </span>
                          );
                        }) 
                      : null
                      }
                      {" "}

                      {/* 50 */}
                      {doseregime?.data?.dosering?.dose ? doseregime.data.dosering.dose : null}
                      {" "}

                      {
                        doseregime?.data?.dosering?.styrkeEnhetDosering ? 
                          doseregime?.data?.dosering?.styrkeEnhetDosering?.display
                        : null
                      }

                      {
                        " x "
                      }

                      {
                        doseregime?.data?.frekvensdoseringsregimePerDogn ? 
                          doseregime?.data?.frekvensdoseringsregimePerDogn
                        : null
                      }

                      {
                        doseregime?.data?.varighetDoseringsregimeAntallDogn ? 
                          " i " + 
                          doseregime?.data?.varighetDoseringsregimeAntallDogn 
                          + " døgn"
                        : null
                      }

                    </div>
                  );
                })
              : null
            }

            {
              doseregime?.tekst ? doseregime.tekst : null
            } 

          </div>
        </div>
      );
    })
  }

  renderDoseRegimerHensyn(doseringregimer) {
    return (
      <div>
        <CollapsibleHead>
          {
            doseringregimer?.length > 0 && doseringregimer?.some(doseregime => doseregime?.data?.kontraindikasjoner) ? 
              (<h4>Spesielle hensyn: </h4>)
            : null
          }
        </CollapsibleHead>

        <CollapsibleContent>
          {doseringregimer.map((doseregime, dosregindex) => {
              return (
                <div key={dosregindex}>
                    {/* <div style={{fontWeight: "bold"}}>kontraindikasjoner: {dosregindex + 1}</div> */}
                      {doseregime?.data.kontraindikasjoner ? 
                        doseregime?.data.kontraindikasjoner.map((item, index)=>{
                          let itemText = item?.tekst || null; 
                          return (
                            <div key={index}>
                              
                              {
                                item.data?.tilstand?.koder.map((inneritemt, innerindext)=> {
                                  return (
                                    <div key={innerindext}>
                                      {/* Tilstand */}
                                      {
                                        <h5>{inneritemt?.display ? inneritemt.display : null}</h5>
                                      }
                                    </div>
                                  );

                                })
                              }
                              {
                                item.data.virkestoff.koder.map((inneritemv, innerindexv)=> {
                                  return (
                                    <div key={innerindexv}>
                                      {/* Virkestoff */}
                                      {
                                        <b>{inneritemv?.display ? inneritemv.display : null}</b>
                                      }
                                    </div>
                                  );
                                })
                              }
                              {
                                <div className="form-group" dangerouslySetInnerHTML={{ __html: itemText }}></div>
                              }
                            </div>
                          );
                        }
                      )
                      : null}
                </div>
              );
            })
          }
        </CollapsibleContent>
      </div>
    );

      // doseringregimer.map((doseregime, dosregindex) => {
      //   return (
      //     <div key={dosregindex}>                        
      //         <CollapsibleHead>
      //           {
      //             doseregime?.data?.kontraindikasjoner ? 
      //               (<h4 style={{color: "green"}}>Spesielle hensyn: </h4>)
      //             : null
      //           }
      //         </CollapsibleHead>

      //         <CollapsibleContent>
      //           {doseregime?.data.kontraindikasjoner ? 
      //             doseregime?.data.kontraindikasjoner.map((item, index)=>{
      //               let itemText = item?.tekst || null;
      //               return (
      //                 <div key={index}>
                        
      //                   {
      //                     item.data?.tilstand?.koder.map((inneritemt, innerindext)=> {
      //                       return (
      //                         <div key={innerindext}>
      //                           {/* Tilstand */}
      //                           {
      //                             <h5>{inneritemt?.display ? inneritemt.display : null}</h5>
      //                           }
      //                         </div>
      //                       );

      //                     })
      //                   }
      //                   {
      //                     item.data.virkestoff.koder.map((inneritemv, innerindexv)=> {
      //                       return (
      //                         <div key={innerindexv}>
      //                           {/* Virkestoff */}
      //                           {
      //                             <b>{inneritemv?.display ? inneritemv.display : null}</b>
      //                           }
      //                         </div>
      //                       );
      //                     })
      //                   }
      //                   {
      //                     <div className="form-group" dangerouslySetInnerHTML={{ __html: itemText }}></div>
      //                   }
      //                 </div>
      //               );
      //             }
      //           )
      //           : null}
      //         </CollapsibleContent>
      //     </div>
      //   );
      // })
  }

  // rendering behandlinger
  renderItemBehandlinger(behandlinger) {
    console.log(behandlinger);
      
    if (behandlinger != null) {
      return (
        behandlinger.map((item, index) => (
          <div key={index}>
            <div className="form-group">
              <b><h1>{item.overskrift ? item.overskrift : ""}</h1></b>
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.behandling.tekst}}></div>
            
            <div className="form-group">
              { item.behandling?.data?.ledetekstVarighetBehandling ? 
                  ("Written out: " 
                  + item.behandling?.data?.ledetekstVarighetBehandling)
                : null
              }
            </div>

            <div className="form-group">
              { item.behandling?.data?.varighetBehandlingAntallDogn ? 
                  ("Anbefalt behandlingsvarighet ved ukomplisert forløp (inkludert eventuell oral behandling): " +
                  item.behandling?.data?.varighetBehandlingAntallDogn + " døgn")
                : null
              }
            </div>


            {/* Standard behandlingsregimer med antibiotika */}
            <div className="form-group">
              {
                item?.behandling?.data?.standardbehandlingsregimer ? 
                  <h2>
                    {
                      item?.behandling?.data?.overskriftBehandlingsregime ?
                        item?.behandling?.data?.overskriftBehandlingsregime 
                      : "Standardbehandling" 
                    }
                    </h2>
                : null
              }
            </div>

            {item?.behandling?.data?.standardbehandlingsregimer ?
              item.behandling.data.standardbehandlingsregimer.map((regime, regIndex) => {
                return (
                  <div key={regIndex}>
                    {/* standardbehandlingsregimer for voksne eller barn */}
                    <div className="form-group"><h3>{regime.overskrift}</h3></div>

                    {regime?.doseringregimer ? this.renderDoseRegimerHeads(regime.doseringregimer) : null}
                    {regime?.doseringregimer ? this.renderDoseRegimerHensyn(regime.doseringregimer) : null}

                  </div>
                );
              })
            : null}

            {/* Behandlingsalternativer (hardcoded title) */}
            <div className="form-group">
              {
                item?.behandling?.data?.alternativebehandlingsregimer ? 
                  <h2>Hardcoded title: Behandlingsalternativer</h2>
                : null
              }     
            </div>  

            {item?.behandling?.data?.alternativebehandlingsregimer ?
              item.behandling.data.alternativebehandlingsregimer.map((regime, regIndex) => {
                return (
                  <div key={regIndex}>
                    {/* alternativebehandlingsregimer for voksne eller barn */}
                     <div className="form-group"><h3>{regime?.overskrift ? regime.overskrift : null}</h3></div>

                     {regime?.doseringregimer ? this.renderDoseRegimerHeads(regime.doseringregimer) : null}
                     {regime?.doseringregimer ? this.renderDoseRegimerHensyn(regime.doseringregimer) : null}

                  </div>
                );
              })
            : null}

            {/* Overgang til oral behandling (hardcoded title) */}
            <div className="form-group">
              {
                item?.behandling?.data?.overgangtiloralbehandlingsregimer ? 
                  <h2>Hardcoded title: Overgang til oral behandling</h2>
                : null
              }
            </div>

            {item?.behandling?.data?.overgangtiloralbehandlingsregimer ?
              item.behandling.data.overgangtiloralbehandlingsregimer.map((regime, regIndex) => {
                return (
                  <div key={regIndex}>
                    {/* overgangtiloralbehandlingsregimer */}
                    {/* make it instead of the harcoded title?:  */}
                    <div className="form-group"><h2>{regime?.overskrift ? regime.overskrift : null}</h2></div>

                    {regime?.doseringregimer ? this.renderDoseRegimerHeads(regime.doseringregimer) : null}
                    {regime?.doseringregimer ? this.renderDoseRegimerHensyn(regime.doseringregimer) : null}

                  </div>
                );
              })
            : null}


          </div>
        ))
      );
    }

  }
  //////////////////////


  renderLinksList(links) {
    if (links != null) {
      //array of children links:
      let barn = [];
      links.forEach((link) => {
        //creating a field manually (name of the link):
        if (link.$title) barn.push(link);
      });

      if (barn.length > 0) {
        return barn.map((item, index) => (
          <li key={index}>
            <div>
              {item.rel === "barn" ? (
                <span>
                  <b>Barn:&nbsp;</b>
                </span>
              ) : null}
              {item.rel === "forelder" ? (
                <span>
                  <b>Forelder:&nbsp;</b>
                </span>
              ) : null}
              {item.rel === "root" ? (
                <span>
                  <b>Root:&nbsp;</b>
                </span>
              ) : null}
              {/*onClick making linkCallback: call the function from HomePage : */}
              <span
                className="link"
                onClick={() => this.props.linkCallback(item.href)}
              >
                {item.$title}
              </span>
            </div>
          </li>
        ));
      }
    }
  }

  renderJson() {
    if (this.props.data) {
      // if the response from HomePage "data={this.state.response}" was recived:
      let json = JSON.parse(this.props.data);

      // check if getId name was added to the home name
      if (Array.isArray(json) && window.location.href.indexOf("getid") > -1) {
        return json.map((item, index) => (
          //...and render of the getIt page happens here
          <div key={index}>
            <div>
              <b>Tittel:</b>
              <span>{item.tittel}</span>
            </div>
            <div>
              <b>ID:</b>
              <span>{item.id}</span>
            </div>
            <br></br>
          </div>
        ));
      }
      // if the home page address remains the same, HomePage render occurs
      else if (
        Array.isArray(json) &&
        !window.location.href.indexOf("getid") > -1
      ) {
        return json.map((item, index) => (
          <div key={index}>
            <div>{this.renderItem(item)}</div>
          </div>
        ));
      } else {
        //
        let item = json;
        return this.renderItem(item, 0);
      }
    }
    // if no responce:
    return "";
  }

  renderLinks(links) {
    if (links != null)
      return links.map((item, index) => (
        <div key={index}>
          <table>
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold" }}>Rel</td>
                <td>{item.rel ? item.rel : ""}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: "bold" }}>Type</td>
                <td>{item.type ? item.type : ""}</td>
              </tr>

              <tr>
                {/*onClick making linkCallback: call the function from HomePage : */}
                <td>Href</td>
                <td>
                  <div
                    className="link"
                    onClick={() => this.props.linkCallback(item.href)}
                  >
                    {item.href ? item.href : ""}
                  </div>
                </td>
              </tr>

              <tr>
                <td>Struktur Id</td>
                <td>{item.strukturId ? item.strukturId : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ));
  }

  /*renderTema(tema) {

    if (tema != null)

      return tema.map((item, index) =>
     
        <div key={index}>
          
          <table><tbody>

            <tr>
              <td style={{ fontWeight: "bold"}}>Tema</td><td>{item.tema ? item.tema : null }</td>
            </tr>

          </tbody></table>

        </div>);
  } */
};

export default HTMLRender;
