package jp.openform;

public enum DataSourceFieldType {

	STRING("str"),
	
	NUMBER("num"),
	
	INTEGER("int"),
	
	BOOLEAN("bool"),
	
	;
	
	private final String code;
	
	private DataSourceFieldType(final String code) {
		this.code = code;
	}
	
	public String code() {
		return code;
	}
	
	public static DataSourceFieldType valueOfByCode(final String code) {
		for (final DataSourceFieldType type : values()) {
			if (type.code().equals(code)) return type;
		}
		return null;
	}
	
}
