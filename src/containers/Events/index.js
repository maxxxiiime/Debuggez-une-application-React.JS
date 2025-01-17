import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState("Toutes");
  const [currentPage, setCurrentPage] = useState(1);

  const categorieFilter = (events) => {
    if (type === "Toutes") {
      // Si "Toutes" est sélectionné, retourne Toutes les catégories événements.
      return events || [];
    }

    // Sinon, filtre les événements par type.
    return events?.filter((event) => event.type === type) || [];
  };

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);

  };

  const allEvents = categorieFilter(data?.events);
  const pageNumber = Math.ceil(allEvents.length / PER_PAGE);
  const typeList = new Set(data?.events.map((event) => event.type));

  // Calcule l'indice de début et de fin des événements à afficher pour gerer la pagination
  const startIndex = (currentPage - 1) * PER_PAGE;
  const endIndex = startIndex + PER_PAGE;

  // Filtre les événements à afficher sur la page actuelle.
  const visibleEvents = allEvents.slice(startIndex, endIndex);

  console.log(visibleEvents)
  console.log(allEvents)
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            value={type} // Valeur sélectionnée
            onChange={changeType}
          />
          
{/* // les evenements filtré sont affiché */}       
          <div id="events" className="ListContainer" data-testid="listEventsTest">

            {visibleEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>

          <div className="Pagination">
            {[...Array(pageNumber)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
