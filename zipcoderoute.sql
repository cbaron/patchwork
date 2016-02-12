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
-- Name: zipcoderoute; Type: TABLE; Schema: public; Owner: cbaron; Tablespace: 
--

CREATE TABLE zipcoderoute (
    id integer NOT NULL,
    zipcode character varying(10),
    routeid integer
);


ALTER TABLE public.zipcoderoute OWNER TO cbaron;

--
-- Name: zipcoderoute_id_seq; Type: SEQUENCE; Schema: public; Owner: cbaron
--

CREATE SEQUENCE zipcoderoute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.zipcoderoute_id_seq OWNER TO cbaron;

--
-- Name: zipcoderoute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cbaron
--

ALTER SEQUENCE zipcoderoute_id_seq OWNED BY zipcoderoute.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cbaron
--

ALTER TABLE ONLY zipcoderoute ALTER COLUMN id SET DEFAULT nextval('zipcoderoute_id_seq'::regclass);


--
-- Data for Name: zipcoderoute; Type: TABLE DATA; Schema: public; Owner: cbaron
--

COPY zipcoderoute (id, zipcode, routeid) FROM stdin;
1	45005	2
2	45066	2
3	45068	2
4	45305	2
5	45309	1
6	45314	2
7	45315	1
8	45322	1
9	45323	2
10	45324	3
11	45325	3
12	45327	3
13	45342	3
14	45345	3
15	45370	3
16	45385	3
17	45387	3
18	45402	3
19	45403	3
20	45404	1
21	45405	1
22	45406	1
23	45409	1
24	45410	1
25	45414	1
26	45415	1
27	45416	5
28	45417	3
29	45419	5
30	45420	5
31	45424	5
32	45426	5
33	45430	4
34	45429	5
35	45431	4
36	45432	4
37	45433	4
38	45434	4
39	45439	4
40	45440	4
41	45449	4
42	45458	4
43	45459	4
44	45469	5
45	45502	4
\.


--
-- Name: zipcoderoute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cbaron
--

SELECT pg_catalog.setval('zipcoderoute_id_seq', 45, true);


--
-- Name: zipcoderoute_pkey; Type: CONSTRAINT; Schema: public; Owner: cbaron; Tablespace: 
--

ALTER TABLE ONLY zipcoderoute
    ADD CONSTRAINT zipcoderoute_pkey PRIMARY KEY (id);


--
-- Name: zipcoderoute_routeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cbaron
--

ALTER TABLE ONLY zipcoderoute
    ADD CONSTRAINT zipcoderoute_routeid_fkey FOREIGN KEY (routeid) REFERENCES deliveryroute(id);


--
-- PostgreSQL database dump complete
--

