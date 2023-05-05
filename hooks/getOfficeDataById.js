import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const getOfficeDataById = (officeGet) => {
  const [office, setOffice] = useState(null);
  const [OfficeLoading, setOfficeLoading] = useState(true);
  const [officeReload, setOfficeReload] = useState(null);

  useEffect(async () => {
    if (officeGet) {
      // get user data bt id
      setOfficeLoading(true);
      await axios({
        method: "GET",
        url: "/api/offices/" + officeGet.officeid,
      })
        .then((res) => {
          console.log(res.data.data);
          setOffice(res.data.data);
          setOfficeLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return officeGet;
    }
  }, [officeGet, officeReload]);
  return {
    office,
    OfficeLoading,
    officeReload,
    setOfficeReload,
  };
};

export default getOfficeDataById;
