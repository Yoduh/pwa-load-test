import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player'
import PDFViewer from '../components/PDFViewer';
import Dexie from 'dexie'
import './Home.css';

const Home = () => {
  const [pdf, setPdf] = useState(null);
  const [video, setVideo] = useState(null);
  const [db, createDb] = useState(null);
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    createDb(new Dexie('db'));
  }, []);

  useEffect(() => {
    if (db != null) {
      db.version(1).stores({ blobs: '++id, name, type' })
      db.blobs.toArray().then(r => setItems(r));
    }
  }, [db])
  
  const downloadBlobs = async () => {
    const requests = [];
    for (let i = 1; i <= 5; i++) {
      const url = `https://load-test-pwa.herokuapp.com/video${i}.mp4`;
      const prom = fetch(url).then(r => {
        if (r.status !== 404) return r.blob();
        else return null;
      })
      .then(blob => {
        if (blob !== null) {
          return { blob: blob, name: `video${i}`, type: 'mp4'};
        }
      })
      requests.push(prom);
    }

    for (let i = 1; i <= 150; i++) {
      const url = `https://load-test-pwa.herokuapp.com/refman_${i}.pdf`;
      const prom = fetch(url).then(r => {
        if (r.status !== 404) return r.blob();
        else return null;
      })
      .then(blob => {
        if (blob !== null) {
          return { blob: blob, name: `refman_${i}`, type: 'pdf'};
        }
      })
      requests.push(prom);
    }
    return Promise.all(requests);
  }

  const populateDb = async () => {
    db.blobs.clear();
    downloadBlobs()
      .then(results => {
        results.forEach((r,idx) => r.id = idx );
        db.blobs.bulkPut(results)
        .then(() => {
          db.blobs.toArray()
            .then(r => { 
              console.log("r", r);
              setItems(r);
            });
        })
    });
  }

  const deleteDb = async () => {
    db.blobs.clear();
    setItems([]);
    setPdf(null);
  }

  const pdfList = () => {
    if (db === null) return <div>DB is empty</div>;
    return (
      items.length === 0 ? <div>DB is empty</div>
      : items.map((item, i) => {
        return (
          item.type === 'pdf' ?
          <li key={i}>
            {item.name} 
            <button onClick={() => {
              setVideo(null);
              setPdf(URL.createObjectURL(item.blob)); 
            }}>
              View PDF
            </button>
          </li>
          :
          <li key={i}>
            {item.name} 
            <button onClick={() => {
              setPdf(null); 
              setVideo(URL.createObjectURL(item.blob));
            }}>
              View Video
            </button>
          </li>
        )
      })
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Test</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Test</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <button onClick={() => populateDb()}>Download PDFs</button>
              ...
              <button onClick={() => deleteDb()}>Delete DB</button>
              <div>
                Items in IndexedDb
                <ul>
                  {pdfList()}
                </ul>
              </div>
            </IonCol>
            <IonCol>
              <PDFViewer pdf={pdf} />
              <ReactPlayer 
                url={video} 
                playing
                controls
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
