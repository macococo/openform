package jp.openform;

import org.json.JSONObject;

public class DataSources extends JsonObjectWrapper {
	
	public static final String ID_MAIN = "main";
	
	public DataSources() {
		this((JSONObject) null);
		
		final DataSource mainDataSource = new DataSource(ID_MAIN);
		addDataSource(mainDataSource);
	}
	
	public DataSources(final String jsonString) {
		this(JsonUtil.parse(jsonString));
	}
	
	public DataSources(final JSONObject data) {
		super(data);
	}
	
	public DataSources addDataSource(final DataSource dataSource) {
		JsonUtil.put(data, dataSource.getId(), dataSource.toJson());
		return this;
	}
	
	public DataSource getDataSource(final String id) {
		return new DataSource(JsonUtil.getJsonObject(data, id));
	}
	
	public DataSource getMainDataSource() {
		return getDataSource(ID_MAIN);
	}
	
}
