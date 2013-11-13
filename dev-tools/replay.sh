http -f POST localhost:8087/dmp/resources/ name='mabxml-1.xsd' description='Mab XML Schema' file@~/Development/Projects/DMP/controller/src/main/resources/mabxml-1.xsd
http POST localhost:8087/dmp/resources/1/configurations id=1 name=schema description='MabXMLSchema' parameters:='{"storage_type":"schema"}'
http -f POST localhost:8087/dmp/resources/ name='mabxmlsimple.csp.xml' description='Mab XML Data' file@~/Development/Projects/DMP/controller/src/main/resources/mabxmlsimple.csp.xml
http POST localhost:8087/dmp/resources/2/configurations id=1 name=xml parameters:='{"storage_type":"xml","record_tag":"datensatz","xml_namespace":"http://www.ddb.de/professionell/mabxml/mabxml-1.xsd","schema_file":{"id":1,"name":"mabxml-1.xsd","type":"FILE","description":"Mab XML Schema","attributes":{"path":"/Users/knut/Development/Projects/DMP/init/../tmp/resources/mabxml-1.xsd","filesize":-1},"configurations":[{"id":1,"name":"schema","description":"schema with id 1","resources":[{"id":1}],"parameters":{"storage_type":"schema"}}],"storage_type":"schema"}}'
http GET localhost:8087/dmp/resources/1/configurations/1/schema
http GET localhost:8087/dmp/resources/2/configurations/2/schema
http GET localhost:8087/dmp/resources/2/configurations/2/data atMost==2
