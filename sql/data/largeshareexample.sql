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
-- Name: largeshareexample; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE largeshareexample (
    id integer NOT NULL,
    content character varying(100),
    "position" integer
);


ALTER TABLE largeshareexample OWNER TO scott;

--
-- Name: largeshareexample_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE largeshareexample_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE largeshareexample_id_seq OWNER TO scott;

--
-- Name: largeshareexample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE largeshareexample_id_seq OWNED BY largeshareexample.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY largeshareexample ALTER COLUMN id SET DEFAULT nextval('largeshareexample_id_seq'::regclass);


--
-- Data for Name: largeshareexample; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY largeshareexample (id, content, "position") FROM stdin;
1	1 head of lettuce	1
2	1.5 lbs summer squash	2
3	1.5 lbs tomatoes	3
4	2 lbs green cabbage	4
5	1.5 lbs eggplant	5
6	2 lbs potatoes	6
7	1 lb sweet peppers	7
8	1 head of garlic	8
9	1 lb beans	9
10	1 bunch of cilantro	10
11	6 ears of corn	11
12	and a sunflower!	12
\.


--
-- Name: largeshareexample_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('largeshareexample_id_seq', 12, true);


--
-- Name: largeshareexample_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY largeshareexample
    ADD CONSTRAINT largeshareexample_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

