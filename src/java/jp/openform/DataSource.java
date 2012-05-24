package jp.openform;

import org.json.JSONArray;
import org.json.JSONObject;

public class DataSource extends JsonObjectWrapper {
	
	public DataSource(final String id) {
		this(createDefaultJsonObject());
		setId(id);
	}
	
	public DataSource(final JSONObject data) {
		super(data);
	}
	
	private static JSONObject createDefaultJsonObject() {		
		final JSONObject json = new JSONObject();
		JsonUtil.put(json, "fields", new JSONArray());
		JsonUtil.put(json, "records", new JSONArray());
		return json;
	}
	
	public String getId() {
		return JsonUtil.getString(data, "id");
	}
	
	public DataSource setId(final String id) {
		JsonUtil.put(data, "id", id);
		return this;
	}
	
	public DataSourceFields getFields() {
		return new DataSourceFields(JsonUtil.getJsonArray(data, "fields"));
	}
	
	public DataSourceRecord addRecord() {
		final DataSourceRecord record = new DataSourceRecord(this);
		addRecord(record);
		return record;
	}
	
	public DataSource addRecord(final DataSourceRecord record) {
		final JSONArray array = JsonUtil.getJsonArray(data, "records");
		array.put(record.toJson());
		return this;
	}
	
	public int getRecordSize() {
		return JsonUtil.getJsonArray(data, "records").length();
	}
	
	public DataSourceRecord getRecord(final int index) {
		return new DataSourceRecord(this, JsonUtil.getJsonArrayByArray(JsonUtil.getJsonArray(data, "records"), index));
	}

}
