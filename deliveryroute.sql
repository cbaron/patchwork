--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: deliveryroute; Type: TABLE; Schema: public; Owner: cbaron; Tablespace: 
--

CREATE TABLE deliveryroute (
    id integer NOT NULL,
    label character varying(50),
    dayofweek integer,
    starttime time with time zone,
    endtime time with time zone
);


ALTER TABLE public.deliveryroute OWNER TO cbaron;

--
-- Name: deliveryroute_id_seq; Type: SEQUENCE; Schema: public; Owner: cbaron
--

CREATE SEQUENCE deliveryroute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.deliveryroute_id_seq OWNER TO cbaron;

--
-- Name: deliveryroute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cbaron
--

ALTER SEQUENCE deliveryroute_id_seq OWNED BY deliveryroute.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cbaron
--

ALTER TABLE ONLY deliveryroute ALTER COLUMN id SET DEFAULT nextval('deliveryroute_id_seq'::regclass);


--
-- Data for Name: deliveryroute; Type: TABLE DATA; Schema: public; Owner: cbaron
--

COPY deliveryroute (id, label, dayofweek, starttime, endtime) FROM stdin;
1	US35 / I675 Loop	5	01:00:00-06	07:00:00-06
2	Center Dayton	4	01:00:00-06	07:00:00-06
3	Germantown	5	01:00:00-06	07:00:00-06
4	North Dayton	4	01:00:00-06	07:00:00-06
5	Yellow Springs	5	01:00:00-06	07:00:00-06
6	farm	3	11:00:00-06	18:00:00-06
\.


--
-- Name: deliveryroute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cbaron
--

SELECT pg_catalog.setval('deliveryroute_id_seq', 6, true);


--
-- Name: deliveryroute_pkey; Type: CONSTRAINT; Schema: public; Owner: cbaron; Tablespace: 
--

ALTER TABLE ONLY deliveryroute
    ADD CONSTRAINT deliveryroute_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

