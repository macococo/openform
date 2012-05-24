package jp.openform;

import org.json.JSONObject;

public class DataSourceField extends JsonObjectWrapper {
	
	public DataSourceField() {
		this(null);
	}

	public DataSourceField(final JSONObject data) {
		super(data);
	}

	public String getName() {
		return JsonUtil.getString(data, "name");
	}
	
	public DataSourceField setName(final String name) {
		JsonUtil.put(data, "name", name);
		return this;
	}

	public String getCaption() {
		return JsonUtil.getString(data, "caption");
	}
	
	public DataSourceField setCaption(final String caption) {
		JsonUtil.put(data, "caption", caption);
		return this;
	}

	public DataSourceFieldType getType() {
		return DataSourceFieldType.valueOfByCode(JsonUtil.getString(data, "type"));
	}
	
	public DataSourceField setType(final DataSourceFieldType type) {
		JsonUtil.put(data, "type", type.code());
		return this;
	}

	public Integer getLength() {
		return JsonUtil.getInt(data, "length");
	}
	
	public DataSourceField setLength(final Integer length) {
		JsonUtil.put(data, "length", length);
		return this;
	}
	
	public boolean isRequired() {
		return JsonUtil.getBoolean(data, "required");
	}
	
	public DataSourceField setRequired(final boolean required) {
		JsonUtil.put(data, "required", required);
		return this;
	}

	public Double getMax() {
		return JsonUtil.getDouble(data, "max");
	}
	
	public DataSourceField setMax(final Double max) {
		JsonUtil.put(data, "max", max);
		return this;
	}

	public Double getMin() {
		return JsonUtil.getDouble(data, "min");
	}
	
	public DataSourceField setMin(final Double min) {
		JsonUtil.put(data, "min", min);
		return this;
	}
	
}
