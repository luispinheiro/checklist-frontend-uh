import { useContext, useState, useEffect  } from "react";
import { AuthContext } from "./useAuth"


export const useNavBarItems = () => {
  const auth = useContext(AuthContext);
  const [ items, setItems ] = useState([]);
  const [ helloMessage, setHelloMessage ] = useState(null);

  useEffect(() => {

    const activate = (clickedItem) => {
        if (!clickedItem.active) {
            setItems(items.map(item => item.name === clickedItem.name ?
                { ...item, active: true } : { ...item, active: false }));
        }
    }

    const items = [
        { name: "List", href: "/", active: true, onClick: activate },
        { name: "New", href: "/form", active: false, onClick: activate }
    ];

    if (auth.isAuthenticated()) {
      items.push({ name: "Logout", active: false, href: "#", onClick: () => {
          auth.logout();
          setHelloMessage(null)
      }});
      setHelloMessage(`Olá, ${auth.credentials.displayName}!`);
    }

    setItems(items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [auth.credentials]);

return { items, helloMessage };

}
